import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from './utils/api';
import { useAuth } from './utils/authContext';

const SignIn = () => {
    const eyeIconRef = useRef();
    const passwordInputRef = useRef();
    const navigate = useNavigate();
    const { user, login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            if (user.role === 'lawyer') {
                navigate('/dashboard');
            } else {
                navigate('/lawyer');
            }
        }
    }, [user, navigate]);

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

    const handleSubmit = async () => {
        try {
            setError("");
            setLoading(true);
            
            const { email, password } = form;

            if (!email || !password) {
                setError("Please fill all fields");
                return;
            }

            if (!email.includes("@")) {
                setError("Enter a valid email address");
                return;
            }

            const userData = await loginUser({ email, password });
            login(userData);
            
            // Redirect based on user role
            if (userData.role === 'lawyer') {
                navigate('/dashboard');
            } else {
                navigate('/lawyer');
            }
            
        } catch (error) {
            setError(error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-1/2 flex justify-center items-center p-10">
                <div className="w-96 text-center">
                    <h2 className="text-5xl font-bold mb-10">Log In</h2>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={form.email}
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

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full mt-4 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-purple-800 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="mb-2">
                            Don't have an account?{' '}
                            <Link to="/clientregister" className="text-blue-700 hover:underline">
                                Register as Client
                            </Link>
                        </p>
                        <p>
                            Are you a lawyer?{' '}
                            <Link to="/lawyerregister" className="text-green-700 hover:underline">
                                Register as Lawyer
                            </Link>
                        </p>
                    </div>
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
