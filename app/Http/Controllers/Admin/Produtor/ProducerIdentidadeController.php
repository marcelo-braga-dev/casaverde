<?php

namespace App\Http\Controllers\Admin\Produtor;

use App\Http\Controllers\Controller;
use App\Models\Produtor\ProducerProfile;
use Illuminate\Http\Request;

class ProducerIdentidadeController extends Controller
{
    public function update(Request $request, ProducerProfile $producerProfile)
    {
        $tipoPessoa = $producerProfile->tipo_pessoa;

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

        $profileFields = array_intersect_key($data, array_flip(['nome', 'razao_social', 'nome_fantasia']));
        if ($profileFields) {
            $producerProfile->update($profileFields);
        }

        $contactFields = array_intersect_key($data, array_flip(['email', 'celular']));
        if ($contactFields && $producerProfile->contacts) {
            $producerProfile->contacts()->update($contactFields);
        }

        return back()->with('success', 'Dados do produtor atualizados com sucesso.');
    }
}
