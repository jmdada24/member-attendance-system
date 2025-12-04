<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    //
    protected $fillable = ['member_id', 'time_in'];

    public function member(){

        return $this->belongsTo(Member::class);

    }

}
