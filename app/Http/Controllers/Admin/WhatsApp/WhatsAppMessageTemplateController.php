<?php

namespace App\Http\Controllers\Admin\WhatsApp;

use App\Http\Controllers\Controller;
use App\Http\Requests\WhatsApp\UpdateWhatsAppMessageTemplateRequest;
use App\Models\WhatsApp\WhatsAppMessageTemplate;
use Inertia\Inertia;

class WhatsAppMessageTemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/WhatsApp/Templates/Index/Page', [
            'templates' => WhatsAppMessageTemplate::query()
                ->orderBy('category')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(UpdateWhatsAppMessageTemplateRequest $request, WhatsAppMessageTemplate $template)
    {
        $template->update($request->validated());

        return redirect()->back()->with('success', 'Template atualizado com sucesso.');
    }
}
