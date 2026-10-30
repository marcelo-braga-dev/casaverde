<?php

namespace App\Enums\Usina;

enum UsinaOnboardingStage: string
{
    case DocumentAnalysis = 'document_analysis';
    case ContractSignature = 'contract_signature';
    case RegistrationForm = 'registration_form';
    case MembershipAgreement = 'membership_agreement';
    case LeaseAgreement = 'lease_agreement';
    case OwnershipTransfer = 'ownership_transfer';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::DocumentAnalysis => 'Análise de documentos',
            self::ContractSignature => 'Assinatura de contrato',
            self::RegistrationForm => 'Ficha de inscrição',
            self::MembershipAgreement => 'Contrato de adesão',
            self::LeaseAgreement => 'Contrato de aluguel',
            self::OwnershipTransfer => 'Troca de titularidade',
            self::Completed => 'Concluído',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DocumentAnalysis => '#1976d2',
            self::ContractSignature => '#ed6c02',
            self::RegistrationForm => '#7b1fa2',
            self::MembershipAgreement => '#283593',
            self::LeaseAgreement => '#c2185b',
            self::OwnershipTransfer => '#00838f',
            self::Completed => '#2e7d32',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn (self $stage) => [
                'value' => $stage->value,
                'label' => $stage->label(),
                'color' => $stage->color(),
            ],
            self::cases()
        );
    }
}
