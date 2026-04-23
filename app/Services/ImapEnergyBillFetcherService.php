<?php

namespace App\Services\Energia\Imap;

use App\Models\Importacao\ClientEmailImportSetting;
use Carbon\Carbon;
use RuntimeException;

class ImapEnergyBillFetcherService
{
    public function fetchMessages(ClientEmailImportSetting $setting): array
    {
        $mailbox = $this->buildMailboxString($setting);

        $imap = @imap_open(
            $mailbox,
            $setting->imap_email,
            $setting->imap_password,
            0,
            1,
            ['DISABLE_AUTHENTICATOR' => 'GSSAPI']
        );

        if (!$imap) {
            throw new RuntimeException('Falha ao conectar no IMAP: ' . (imap_last_error() ?: 'erro desconhecido'));
        }

        try {
            $criteria = 'UNSEEN';

            if ($setting->sender_filter) {
                $criteria .= ' FROM "' . addslashes($setting->sender_filter) . '"';
            }

            if ($setting->subject_filter) {
                $criteria .= ' SUBJECT "' . addslashes($setting->subject_filter) . '"';
            }

            $uids = imap_search($imap, $criteria, SE_UID);

            if (!$uids) {
                return [];
            }

            rsort($uids);

            $messages = [];

            foreach ($uids as $uid) {
                $messageNumber = imap_msgno($imap, (int) $uid);
                $overviewList = imap_fetch_overview($imap, (string) $messageNumber, 0);
                $overview = $overviewList[0] ?? null;

                if (!$overview) {
                    continue;
                }

                $structure = imap_fetchstructure($imap, $messageNumber);
                if (!$structure) {
                    continue;
                }

                $attachments = $this->extractAttachments($imap, $messageNumber, $structure);

                if (empty($attachments)) {
                    continue;
                }

                $messages[] = [
                    'uid' => (string) $uid,
                    'message_id' => isset($overview->message_id) ? trim((string) $overview->message_id, '<>') : null,
                    'subject' => $this->decodeMimeValue($overview->subject ?? ''),
                    'from' => $this->extractEmailFromHeader($overview->from ?? ''),
                    'received_at' => isset($overview->date) ? Carbon::parse($overview->date) : now(),
                    'attachments' => $attachments,
                ];
            }

            return $messages;
        } finally {
            imap_close($imap);
        }
    }

    private function buildMailboxString(ClientEmailImportSetting $setting): string
    {
        $flags = '/imap';

        if ($setting->imap_encryption === 'ssl') {
            $flags .= '/ssl';
        } elseif ($setting->imap_encryption === 'tls') {
            $flags .= '/tls';
        }

        $flags .= '/novalidate-cert';

        return sprintf('{%s:%d%s}INBOX', $setting->imap_host, $setting->imap_port, $flags);
    }

    private function extractAttachments($imap, int $messageNumber, object $part, string $partNumber = ''): array
    {
        $attachments = [];

        if (isset($part->parts) && is_array($part->parts)) {
            foreach ($part->parts as $index => $childPart) {
                $childPartNumber = $partNumber === ''
                    ? (string) ($index + 1)
                    : $partNumber . '.' . ($index + 1);

                $attachments = array_merge(
                    $attachments,
                    $this->extractAttachments($imap, $messageNumber, $childPart, $childPartNumber)
                );
            }
        }

        $filename = $this->extractFilenameFromPart($part);
        $subtype = strtoupper((string) ($part->subtype ?? ''));

        $isPdf = ($filename && strtolower(pathinfo($filename, PATHINFO_EXTENSION)) === 'pdf')
            || $subtype === 'PDF';

        if ($isPdf) {
            $body = imap_fetchbody($imap, $messageNumber, $partNumber ?: '1', FT_PEEK);

            $attachments[] = [
                'filename' => $filename ?: ('fatura-' . uniqid() . '.pdf'),
                'content' => $this->decodePartBody($body, (int) ($part->encoding ?? 0)),
                'content_type' => 'application/pdf',
            ];
        }

        return $attachments;
    }

    private function extractFilenameFromPart(object $part): ?string
    {
        $attributes = [];

        if (!empty($part->dparameters)) {
            foreach ($part->dparameters as $parameter) {
                $attributes[strtolower($parameter->attribute)] = $parameter->value;
            }
        }

        if (!empty($part->parameters)) {
            foreach ($part->parameters as $parameter) {
                $attributes[strtolower($parameter->attribute)] = $parameter->value;
            }
        }

        return $attributes['filename'] ?? $attributes['name'] ?? null;
    }

    private function decodePartBody(string $body, int $encoding): string
    {
        return match ($encoding) {
            3 => base64_decode($body, true) ?: '',
            4 => quoted_printable_decode($body),
            default => $body,
        };
    }

    private function decodeMimeValue(?string $value): string
    {
        $value = $value ?? '';

        $elements = imap_mime_header_decode($value);
        $decoded = '';

        foreach ($elements as $element) {
            $decoded .= $element->text;
        }

        return trim($decoded);
    }

    private function extractEmailFromHeader(string $header): ?string
    {
        if (preg_match('/<([^>]+)>/', $header, $matches)) {
            return trim($matches[1]);
        }

        return filter_var(trim($header), FILTER_VALIDATE_EMAIL) ?: null;
    }
}