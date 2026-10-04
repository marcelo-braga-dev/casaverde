<?php

/*
 * Modo demonstração: a mesma aplicação, publicada em domínio e banco próprios, aberta a
 * interessados em conhecer a plataforma. Desligado por padrão; só existe quando a
 * instalação define DEMO_MODE=true.
 *
 * No modo demonstração:
 * - /login pede nome + e-mail ou telefone (sem senha) e registra o visitante em demo_leads;
 * - uma barra fixa permite trocar de perfil (admin, consultor, cliente, produtor);
 * - toda alteração é recusada no servidor (somente leitura).
 */
return [

    'enabled' => (bool) env('DEMO_MODE', false),

    // Contas da base de demonstração usadas em cada perfil. Se o e-mail não existir,
    // usa o primeiro usuário ativo do perfil.
    'users' => [
        'admin' => env('DEMO_USER_ADMIN', 'admin@teste.com'),
        'consultor' => env('DEMO_USER_CONSULTOR', 'joao.consultor@demo.com'),
        'cliente' => env('DEMO_USER_CLIENTE', 'sabor.serra@cliente.demo'),
        'produtor' => env('DEMO_USER_PRODUTOR', 'sertao.solar@cliente.demo'),
    ],

    // Perfil em que o visitante entra depois de se identificar.
    'initial_role' => env('DEMO_INITIAL_ROLE', 'admin'),

    // Chave para a equipe de vendas baixar os visitantes em CSV:
    // GET /demo/visitantes.csv?token=... (vazio = download desativado).
    'leads_token' => env('DEMO_LEADS_TOKEN'),

    // Rotas que usam POST só para leitura (geram o PDF temporário de visualização).
    'readonly_post_routes' => [
        'auth.propostas.pdf.cliente.gerar-pdf',
        'auth.propostas.pdf.usina.gerar-pdf',
        'auth.produtor.proposta.api.gerar-pdf',
    ],
];
