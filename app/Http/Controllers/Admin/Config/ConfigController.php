<?php

namespace App\Http\Controllers\Admin\Config;

use App\Http\Controllers\Controller;
use App\Services\Config\ConfigService;
use App\Utils\AlertMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfigController extends Controller
{
    public function index()
    {
        $taxaReducaoConta = (new ConfigService)->getTaxaReducao();

        return Inertia::render('Admin/Config/Index', compact('taxaReducaoConta'));
    }

    public function getTaxaReducaoConta()
    {
        return (new ConfigService)->getTaxaReducao();
    }

    public function updateTaxaReducaoConta(Request $request)
    {
        (new ConfigService)->setTaxaReducao($request->get('taxaReducao'));

        AlertMessage::success('Ação realizada com sucesso');
    }
}
