<?php

namespace App\Http\Controllers\Admin\Endereco;

use App\Http\Controllers\Controller;
use App\Http\Requests\Endereco\StoreAddressRequest;
use App\Models\Endereco\Address;
use App\Repositories\Endereco\AddressRepository;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index(AddressRepository $repository)
    {
        return Inertia::render('Admin/Endereco/Index/Page', [
            'addresses' => $repository->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Endereco/Create/Page');
    }

    public function store(StoreAddressRequest $request)
    {
        $address = Address::create($request->validated());

        return redirect()
            ->route('admin.addresses.show', $address->id)
            ->with('success', 'Endereço cadastrado com sucesso.');
    }

    public function show(Address $address)
    {
        return Inertia::render('Admin/Endereco/Show/Page', [
            'address' => $address,
        ]);
    }

    public function edit(Address $address)
    {
        return Inertia::render('Admin/Endereco/Edit/Page', [
            'address' => $address,
        ]);
    }

    public function update(StoreAddressRequest $request, Address $address)
    {
        $address->update($request->validated());

        return redirect()
            ->route('admin.addresses.show', $address->id)
            ->with('success', 'Endereço atualizado com sucesso.');
    }
}