<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    //

    public function record(Request $request) {
        $request->validate([
            "qr_code" => "required"
        ]);

        $member = Member::where("qr_code", $request->qr_code)->first();

        if(!$member){
            return response()->json(["status" => false, "message" => "Invalid QR"]);
        }

        $attendance = Attendance::create([
            "member_id" => $member->id,
            "time_in" => now()
        ]);

        return response()->json([
            "status" => true,
            "message" => "Attendance recorded",
            "attendance" => $attendance
        ]);
    }

    public function list() {
        return Attendance::with("member")->orderBy("id", "desc")->get();
    }


}
