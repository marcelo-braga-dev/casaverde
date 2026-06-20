<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use Illuminate\Http\Request;

class ClienteIdentidadeController extends Controller
{
    public function update(Request $request, ClientProfile $cliente)
    {
        $tipoPessoa = $cliente->tipo_pessoa;

        $rules = [
            'email' => ['nullable', 'email', 'max:200'],
            'celular' => ['nullable', 'string', 'max:20'],
        ];

        if ($tipoPessoa === 'pf') {
            $rules['nome'] = ['required', 'string', 'min:2', 'max:150'];
        } else {
            $rules['razao_social'] = ['required', 'string', 'min:2', 'max:200'];
            $rules['nome_fantasia'] = ['nullable', 'string', 'max:200'];
        }

        $data = $request->validate($rules, [
            'nome.required' => 'O nome é obrigatório.',
            'razao_social.required' => 'A razão social é obrigatória.',
            'email.email' => 'Informe um e-mail válido.',
        ]);

        // Atualiza perfil
        $profileFields = array_intersect_key($data, array_flip(['nome', 'razao_social', 'nome_fantasia']));
        if ($profileFields) {
            $cliente->update($profileFields);
        }

        // Atualiza contato
        $contactFields = array_intersect_key($data, array_flip(['email', 'celular']));
        if ($contactFields && $cliente->contacts) {
            $cliente->contacts->update($contactFields);
        }

        return back()->with('success', 'Dados do cliente atualizados com sucesso.');
    }
}
