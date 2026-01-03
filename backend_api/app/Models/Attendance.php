<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    //
    protected $fillable = [
        'user_id',
        'scanned_by',
        'scanned_on',
        'scanned_at',

    ];

    protected $casts = [
        'scanned_on' => 'date',
        'scanned_at' => 'datetime',

    ];

    public function user(){
        return $this->belongsTo(User::class);

    }

    public function scanner(){
        return $this->belongsTo(User::class, 'scanned_by');

    }
}
