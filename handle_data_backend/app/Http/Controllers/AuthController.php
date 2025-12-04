<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    //
    public function register(Request $request){
        $data = $request->validate([
            "name" => "required|string",
            "email" => "required|email|unique:users,email",
            "password" => "required|min:6",


        ]);

        $data['password'] = bcrypt($data["password"]);
        User::create($data);
        return response()->json([
            "status" => true,
            "message" => "User registered successfully",

        ]);

    }

    public function login(Request $request){
        $request->validate([
            "email" => "required|email",
            "password" => "required"

        ]);

        if(Auth::attempt($request->only("email", "password"))){
            return response()->json([
                "status" => false,
                "message" => "Invalid Credentials",

            ]);
            
        }

        $user = Auth::user();
        $token = $user->createToken("myToken")->plainTextToken;

        return response()->json([
            "status" => true,
            "token" => $token

        ]); 

    }

    public function profile(){
        return response()->json([
            "status" => true,
            "user" => Auth::user()

        ]);

    }

    public function logout(){
        Auth::user()->tokens->delete();

        return response()->json([
            "status" => true,
            "message" => "Logged out successfully"

        ]);
    }


}
