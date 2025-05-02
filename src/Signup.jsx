import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerLawyer } from './utils/api';

const LawyerRegister = () => {
    const navigate = useNavigate();
    const eyeIconRef = useRef();
    const passwordInputRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        phone: "",
        license: "",
        specialization: "",
        experience: "",
        pricePerSession: "",
        username: "",
        password: "",
        confirmpassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "experience" && Number(value) < 0) {
            return; // prevent negative input
        }

        if (name === "pricePerSession" && Number(value) < 0) {
            return; // prevent negative price
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
        const {
            fullname, email, phone, license, specialization, experience,
            pricePerSession, username, password, confirmpassword
        } = form;

        if (!fullname || !email || !phone || !license || !specialization || !experience || !pricePerSession || !username || !password || !confirmpassword) {
            setError("Please fill all fields.");
            return;
        }

        if (!email.includes("@")) {
            setError("Enter a valid email address.");
            return;
        }

        if (password !== confirmpassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const lawyerData = {
                name: fullname,
                email,
                phone,
                license,
                specialization,
                experience: Number(experience),
                pricePerSession: Number(pricePerSession),
                username,
                password,
            };
            
            const response = await registerLawyer(lawyerData);
            
            if (response.success) {
                alert("Lawyer Registered Successfully!");
                
                // If we received a token directly, go to the dashboard
                if (response.token) {
                    navigate('/dashboard');
                } else {
                    // Otherwise go to login page
                    navigate('/login');
                }
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
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
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
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
                    <input name="pricePerSession" placeholder="Price Per Session (₹)" type="number" value={form.pricePerSession} onChange={handleChange}
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
                        className='w-full mt-4 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-purple-800 transition duration-200 disabled:bg-gray-400'
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </div>

            <div className="w-1/2 h-100vh bg-cover bg-center border-2 border-solid" style={{ backgroundImage: "url('/login.webp')" }}></div>
        </div>
    );
};

export default LawyerRegister;
