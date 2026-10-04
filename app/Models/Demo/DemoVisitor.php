<?php

namespace App\Models\Demo;

use Illuminate\Database\Eloquent\Model;

class DemoVisitor extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'ip_address',
        'user_agent',
        'referer',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'visits',
        'page_views',
        'roles_viewed',
        'last_role',
        'first_seen_at',
        'last_seen_at',
    ];

    protected $casts = [
        'roles_viewed' => 'array',
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
    ];
}
