<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    // Clientes antigos ficaram com "ativo", valor que User::status_nome não reconhece ("1" = Ativo).
    public function up(): void
    {
        DB::table('users')->where('status', 'ativo')->update(['status' => '1']);
    }

    public function down(): void {}
};
