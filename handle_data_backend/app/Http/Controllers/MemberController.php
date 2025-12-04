<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Member::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->validate([
            "name" => "required|string",
            "email" => "required|email|unique:members,email" 

        ]);

        $data["qr_code"] = uniqid("QR");

        $member = Member::create($data);

        return response()->json([
            "status" => true,
            "member" => $member,

        ]);


    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        //
        return $member;

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        //  
        $member->update($request->all());

        return response()->json([
            "status" => true,
            "message" => "Member updated"

        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        //
        $member->delete();

        return response()->json([
            "status" => true,
            "message" => "Member deleted"

        ]);

    }
}
