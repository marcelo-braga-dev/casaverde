<?php

namespace Database\Seeders;

use App\Models\Concessionarias;
use Illuminate\Database\Seeder;

class ConcessionariasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Concessionarias::create(['nome' => 'Eletroacre (Grupo Energisa)', 'estado' => 'AC']);
        Concessionarias::create(['nome' => 'Equatorial Alagoas', 'estado' => 'AL']);
        Concessionarias::create(['nome' => 'CEA (Companhia de Eletricidade do Amapá)', 'estado' => 'AP']);
        Concessionarias::create(['nome' => 'Amazonas Energia', 'estado' => 'AM']);
        Concessionarias::create(['nome' => 'Neoenergia Coelba', 'estado' => 'BA']);
        Concessionarias::create(['nome' => 'Enel Distribuição Ceará', 'estado' => 'CE']);
        Concessionarias::create(['nome' => 'Neoenergia Brasília', 'estado' => 'DF']);
        Concessionarias::create(['nome' => 'EDP Espírito Santo', 'estado' => 'ES']);
        Concessionarias::create(['nome' => 'Enel Distribuição Goiás', 'estado' => 'GO']);
        Concessionarias::create(['nome' => 'Equatorial Maranhão', 'estado' => 'MA']);
        Concessionarias::create(['nome' => 'Energisa Mato Grosso', 'estado' => 'MT']);
        Concessionarias::create(['nome' => 'Energisa Mato Grosso do Sul', 'estado' => 'MS']);
        Concessionarias::create(['nome' => 'Cemig Distribuição', 'estado' => 'MG']);
        Concessionarias::create(['nome' => 'Equatorial Pará', 'estado' => 'PA']);
        Concessionarias::create(['nome' => 'Energisa Paraíba', 'estado' => 'PB']);
        Concessionarias::create(['nome' => 'Energisa Borborema', 'estado' => 'PB']);
        Concessionarias::create(['nome' => 'Copel Distribuição', 'estado' => 'PR']);
        Concessionarias::create(['nome' => 'Neoenergia Pernambuco', 'estado' => 'PE']);
        Concessionarias::create(['nome' => 'Equatorial Piauí', 'estado' => 'PI']);
        Concessionarias::create(['nome' => 'Light SESA', 'estado' => 'RJ']);
        Concessionarias::create(['nome' => 'Enel Distribuição Rio', 'estado' => 'RJ']);
        Concessionarias::create(['nome' => 'Neoenergia Cosern', 'estado' => 'RN']);
        Concessionarias::create(['nome' => 'CEEE Grupo Equatorial', 'estado' => 'RS']);
        Concessionarias::create(['nome' => 'RGE Sul Distribuidora de Energia S.A.', 'estado' => 'RS']);
        Concessionarias::create(['nome' => 'Energisa Rondônia', 'estado' => 'RO']);
        Concessionarias::create(['nome' => 'Roraima Energia', 'estado' => 'RR']);
        Concessionarias::create(['nome' => 'Celesc Distribuição', 'estado' => 'SC']);
        Concessionarias::create(['nome' => 'Enel Distribuição São Paulo', 'estado' => 'SP']);
        Concessionarias::create(['nome' => 'Energisa Sul-Sudeste', 'estado' => 'SP']);
        Concessionarias::create(['nome' => 'CPFL Paulista', 'estado' => 'SP']);
        Concessionarias::create(['nome' => 'CPFL Piratininga', 'estado' => 'SP']);
        Concessionarias::create(['nome' => 'CPFL Santa Cruz', 'estado' => 'SP']);
        Concessionarias::create(['nome' => 'Energisa Sergipe', 'estado' => 'SE']);
        Concessionarias::create(['nome' => 'Energisa Tocantins', 'estado' => 'TO']);
        Concessionarias::create(['nome' => 'Companhia Energética de Roraima (CERR)', 'estado' => 'AC']);
        Concessionarias::create(['nome' => 'Eletrobras', 'estado' => 'BR']);
        Concessionarias::create(['nome' => 'Furnas', 'estado' => 'BR']);
        Concessionarias::create(['nome' => 'Chesf (Companhia Hidro Elétrica do São Francisco)', 'estado' => 'BR']);
        Concessionarias::create(['nome' => 'Eletronorte', 'estado' => 'BR']);
        Concessionarias::create(['nome' => 'Eletrosul', 'estado' => 'BR']);
        Concessionarias::create(['nome' => 'CPFL Sul', 'estado' => 'RS']);
        Concessionarias::create(['nome' => 'RGE (Rio Grande Energia)', 'estado' => 'RS']);
        Concessionarias::create(['nome' => 'Cemig', 'estado' => 'MG']);
        Concessionarias::create(['nome' => 'Amazonas Distribuidora de Energia', 'estado' => 'AM']);
        Concessionarias::create(['nome' => 'Companhia de Eletricidade do Amapá (CEA)', 'estado' => 'AP']);
        Concessionarias::create(['nome' => 'Companhia Energética de Brasília (CEB)', 'estado' => 'DF']);
        Concessionarias::create(['nome' => 'Equatorial Pará', 'estado' => 'PA']);
        Concessionarias::create(['nome' => 'Equatorial Maranhão', 'estado' => 'MA']);
        Concessionarias::create(['nome' => 'Neoenergia Brasília', 'estado' => 'DF']);
    }
}
