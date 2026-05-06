<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date
            ->setTimezone(config('app.timezone'))
            ->format('d/m/Y H:i');
    }
}
