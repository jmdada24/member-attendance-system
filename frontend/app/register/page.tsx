"use client";

import { useState } from 'react';
import api from "@/lib/axios";

export default function RegisterPage(){
    
    const[form, setForm] = useState({
        name: "",
        email: "",
        password: "",

    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await api.post("/register", form);
        alert("Registeration Succesfully");

    };

    return(
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl mb-4">Register</h1>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                className="border p-2 w-full"
                placeholder="Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                className="border p-2 w-full"
                placeholder="Email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                type="password"
                className="border p-2 w-full"
                placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                Register
                </button>
            </form>
        </div>
    );
    

}