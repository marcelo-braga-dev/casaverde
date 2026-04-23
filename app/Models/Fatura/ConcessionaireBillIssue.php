<?php

namespace App\Models\Fatura;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConcessionaireBillIssue extends Model
{
    use HasFactory;

    protected $fillable = [
        'concessionaire_bill_id',
        'issue_code',
        'severity',
        'message',
        'is_resolved',
        'resolved_at',
        'resolved_by_user_id',
    ];

    protected $casts = [
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public function bill()
    {
        return $this->belongsTo(ConcessionaireBill::class, 'concessionaire_bill_id');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by_user_id');
    }
}