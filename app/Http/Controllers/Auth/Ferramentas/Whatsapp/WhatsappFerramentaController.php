<?php

namespace App\Http\Controllers\Auth\Ferramentas\Whatsapp;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class WhatsappFerramentaController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Ferramentas/Whatsapp/Chat/Page');
    }
}
