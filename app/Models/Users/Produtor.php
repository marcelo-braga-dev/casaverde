<?php

namespace App\Models\Users;

use App\src\Roles\RoleUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Produtor extends Model
{
    protected $appends = ['users'];

    protected static function booted()
    {
        static::addGlobalScope('produtor_filter', function ($query) {
            $user = Auth::user();

            //            if ($user && $user->role_id == RoleUser::$ADMIN) return;

            $query->whereHas('produtor', function ($q) use ($user) {
                $q->where('consultor_id', $user->id);
            });
        });
    }

    public function produtores()
    {
        return (new User)->where('role_id', RoleUser::$PRODUTOR)
            ->somenteMeusClientes()
            ->orderBy('id', 'desc')
            ->get();
    }

    public function getUsersAttribute()
    {
        return User::where('role_id', 3)->get();
    }
}
