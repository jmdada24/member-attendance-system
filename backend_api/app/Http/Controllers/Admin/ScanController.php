<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScanController extends Controller
{
    //

    public function store(Request $request){

        $data = $request->validate([
            'qr_token' => ['required', 'string'],

        ]);

        $staff = $request->user();

        return DB::transaction(function() use ($data, $staff){
            $member = User::query()
                ->where('qr_token', $data['qr_token'])
                ->lockForUpdate()
                ->first();

                if(!$member){
                    return response()->json(['message' => 'Invalid QR'], 404);

                }

                if(!$member->hasActiveSubscription()){
                    return response()->json(['message' => 'Subscription inactive/expired'], 403);

                }
                $today = now()->toDateString();

                try {
                    $attendance = Attendance::create([
                        'user_id' => $member->id,
                        'scanned_by' => $staff?->id,
                        'scanned_on' => $today,
                        'scanned_at' => now(),

                    ]);

                }catch(QueryException $e){
                    if (($e->errorInfo[0] ?? null) === '23000'){
                            return response()->json(['message' => 'Already checked in today'], 200);

                        }
                        throw $e;
                    }
                    
                    return response()->json([
                        'message' => 'Check-in recorded',
                        'attendance_id' => $attendance->id, 

                    ], 201); 
        });

    }


}

