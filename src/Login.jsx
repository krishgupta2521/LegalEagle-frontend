import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './utils/api';
import { useAuth } from './utils/authContext';

const Login = () => {
    const navigate = useNavigate();
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showPassword = () => {
        if (ref.current.src.includes("/eyecross.png")) {
            ref.current.src = "/eye.png";
            passwordRef.current.type = "password";
        } else {
            passwordRef.current.type = "text";
            ref.current.src = "/eyecross.png";
        }
    };

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            setError("Fill up all the details");
            return;
        }
        
        if (!form.email.includes("@")) {
            setError("Enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await loginUser({
                email: form.email,
                password: form.password
            });
            
            // Update auth context
            login(response);
            
            // Successful login, redirect based on role
            if (response.role === 'lawyer') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }
            
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-1/2 flex justify-center items-center p-10">
                <div className="w-96 text-center">
                    <h2 className="text-6xl font-bold mb-14 tracking-tight subpixel-antialiased">LOGIN</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    
                    <input
                        value={form.email}
                        onChange={handleChange}
                        placeholder='Enter Email'
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        type="email"
                        name="email"
                    />
                    
                    <div className="relative w-full">
                        <input
                            ref={passwordRef}
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Enter Password'
                            className='w-full p-3 pr-10 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                            type="password"
                            name="password"
                        />
                        <span className='absolute right-3 top-3 cursor-pointer' onClick={showPassword}>
                            <img ref={ref} width={28} src="/eye.png" alt="eye toggle" />
                        </span>
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='w-full cursor-pointer mt-6 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-purple-800 transition duration-200 disabled:bg-gray-400'
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>

            <div className="w-1/2 h-screen bg-cover bg-center border-2 border-solid" style={{ backgroundImage: "url('/signup.jpg')" }}></div>
        </div>
    );
};

export default Login;
