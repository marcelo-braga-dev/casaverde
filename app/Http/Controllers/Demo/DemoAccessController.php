<?php

namespace App\Http\Controllers\Demo;

use App\Http\Controllers\Controller;
use App\Models\Demo\DemoVisitor;
use App\Services\Demo\DemoAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DemoAccessController extends Controller
{
    public function __construct(private readonly DemoAccessService $demo) {}

    public function show(Request $request): Response
    {
        return Inertia::render('Demo/Access', [
            'roles' => array_values(DemoAccessService::ROLES),
            'utm' => $request->only(['utm_source', 'utm_medium', 'utm_campaign']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($this->demo->enabled(), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['nullable', 'email', 'max:255', 'required_without:phone'],
            'phone' => ['nullable', 'string', 'max:20', 'required_without:email', 'regex:/^[\d\s()+-]{8,20}$/'],
            'company' => ['nullable', 'string', 'max:120'],
            'consent' => ['accepted'],
            'utm_source' => ['nullable', 'string', 'max:100'],
            'utm_medium' => ['nullable', 'string', 'max:100'],
            'utm_campaign' => ['nullable', 'string', 'max:100'],
        ], [
            'name.required' => 'Informe seu nome.',
            'email.required_without' => 'Informe um e-mail ou telefone.',
            'phone.required_without' => 'Informe um telefone ou e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'phone.regex' => 'Informe um telefone válido.',
            'consent.accepted' => 'Para acessar, aceite o contato da nossa equipe.',
        ]);

        $visitor = $this->demo->registerVisitor($data, $request);
        $request->session()->regenerate();
        $this->demo->enterAs(config('demo.initial_role', 'admin'), $visitor, $request);

        return redirect()->route('dashboard');
    }

    public function switchRole(Request $request, string $role): RedirectResponse
    {
        abort_unless($this->demo->enabled(), 404);
        abort_unless(array_key_exists($role, DemoAccessService::ROLES), 404);

        $visitor = $this->demo->currentVisitor($request);
        if (! $visitor) {
            return redirect()->route('login');
        }

        $this->demo->enterAs($role, $visitor, $request);

        return redirect()->route('dashboard');
    }

    /** CSV de visitantes para a equipe de vendas: /demo/visitantes.csv?token=DEMO_LEADS_TOKEN */
    public function export(Request $request): StreamedResponse
    {
        $token = (string) config('demo.leads_token');
        abort_unless($this->demo->enabled() && $token !== '' && hash_equals($token, (string) $request->query('token')), 404);

        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // BOM: acentos corretos ao abrir no Excel
            fputcsv($out, DemoVisitorExport::HEADER, ';');
            DemoVisitor::query()->orderByDesc('last_seen_at')->each(
                fn (DemoVisitor $visitor) => fputcsv($out, DemoVisitorExport::row($visitor), ';')
            );
            fclose($out);
        }, 'visitantes-demonstracao-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
