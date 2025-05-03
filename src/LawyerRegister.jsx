import React, { useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { registerLawyer } from "./utils/api";
import { useAuth } from './utils/authContext';
import { toast } from 'react-toastify';

const LawyerRegister = () => {
    const eyeIconRef = useRef();
    const passwordInputRef = useRef();
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        phone: "",
        license: "",
        specialization: "",
        experience: "",
        username: "",
        password: "",
        confirmpassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "experience" && Number(value) < 0) {
            return;
        }

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

    const handleSubmit = async () => {
        try {
            setError("");
            setLoading(true);
            
            const {
                fullname, email, phone, license, specialization, experience,
                username, password, confirmpassword
            } = form;

            if (!fullname || !email || !phone || !license || !specialization || !experience || !username || !password || !confirmpassword) {
                setError("Please fill all required fields");
                return;
            }

            if (!email.includes("@")) {
                setError("Please enter a valid email address");
                return;
            }

            if (password !== confirmpassword) {
                setError("Passwords do not match");
                return;
            }

            const lawyerData = {
                name: fullname,
                email,
                phone,
                license,
                specialization,
                experience: Number(experience),
                username,
                password,
                pricePerSession: 500 // Default price
            };

            const response = await registerLawyer(lawyerData);
            console.log("Lawyer registration successful:", response);
            
            // Store the important fields in localStorage for authContext
            login({
                id: response.lawyerId, // Store unique lawyer ID
                lawyerId: response.lawyerId,
                token: response.token,
                role: response.role,
                name: response.name,
                email: response.email,
                source: 'lawyer' // Add source to identify direct lawyer account
            });
            
            toast.success("Registration successful! Redirecting to dashboard...");
            navigate('/dashboard');
            
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-1/2 flex justify-center items-center p-10">
                <div className="w-96 text-center">
                    <h2 className="text-5xl font-bold mb-10">Lawyer Registration</h2>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <input name="fullname" placeholder="Full Name" type="text" value={form.fullname} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />
                    <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />
                    <input name="phone" placeholder="Phone Number" type="tel" value={form.phone} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />

                    <input name="license" placeholder="License Number" type="text" value={form.license} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />
                    <input name="specialization" placeholder="Specialization (e.g. Criminal Law)" type="text" value={form.specialization} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />
                    <input name="experience" placeholder="Years of Experience" type="number" value={form.experience} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />

                    <input name="username" placeholder="Username" type="text" value={form.username} onChange={handleChange}
                        className='w-full p-3 mb-4 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />

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

                    <input name="confirmpassword" placeholder="Confirm Password" type="password" value={form.confirmpassword} onChange={handleChange}
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700' />

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full mt-4 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-purple-800 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <div className="mt-6 flex space-x-6 justify-center text-[1.2rem]">
                        <p className="text-blue-700 cursor-pointer hover:underline">
                            <Link to="/login">Log In</Link>
                        </p>
                        <p className="text-green-700 cursor-pointer hover:underline">
                            <Link to="/clientregister">Register as a Client</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-1/2 h-100vh bg-cover bg-center border-2 border-solid" style={{ backgroundImage: "url('/login.webp')" }}></div>
        </div>
    );
};

export default LawyerRegister;
