import React, { useRef, useState } from 'react';
import { Link } from "react-router-dom";

const SignIn = () => {
    const eyeIconRef = useRef();
    const passwordInputRef = useRef();

    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmpassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const showPassword = () => {
        if (passwordInputRef.current.type === "password") {
            passwordInputRef.current.type = "text";
            eyeIconRef.current.src = "/eyecross.png";
        } else {
            passwordInputRef.current.type = "password";
            eyeIconRef.current.src = "/eye.png";
        }
    };

    const handleSubmit = () => {
        const { email, username, password, confirmpassword } = form;

        if (!email || !username || !password || !confirmpassword) {
            alert("Please fill all fields.");
            return;
        }

        if (!email.includes("@")) {
            alert("Enter a valid email address.");
            return;
        }

        if (password.length < 10) {
            alert("Password must be at least 10 characters long.");
            return;
        }

        if (password !== confirmpassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Sign In Successful!");
        setForm({
            email: "",
            username: "",
            password: "",
            confirmpassword: ""
        });
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-1/2 flex justify-center items-center p-10">
                <div className="w-96 text-center">
                    <h2 className="text-5xl font-bold mb-10">Log In</h2>

                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                    />

                    <input
                        name="username"
                        placeholder="Username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                    />

                    <div className="relative w-full">
                        <input
                            ref={passwordInputRef}
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className='w-full p-3 pr-10 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        />
                        <span className='absolute right-3 top-3 cursor-pointer' onClick={showPassword}>
                            <img ref={eyeIconRef} width={28} src="/eye.png" alt="Toggle Password" />
                        </span>
                    </div>

                    <input
                        name="confirmpassword"
                        placeholder="Confirm Password"
                        type="password"
                        value={form.confirmpassword}
                        onChange={handleChange}
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                    />

                    <button
                        onClick={handleSubmit}
                        className='w-full mt-4 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-purple-800 transition duration-200'
                    >
                        Log In
                    </button>


                </div>
            </div>

            <div
                className="w-1/2 h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/login.webp')" }}
            ></div>
        </div>
    );
};

export default SignIn;
