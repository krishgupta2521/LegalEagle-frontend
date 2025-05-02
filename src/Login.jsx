import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './utils/api';

const Login = () => {
    const navigate = useNavigate();
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

<<<<<<< HEAD
    const handleSubmit = () => {
        if (!form.email || !form.username || !form.password || !form.confirmpassword || !role) {
            alert("Fill up all the details and choose a role.");
=======
    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            setError("Fill up all the details");
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
            return;
        }
        
        if (!form.email.includes("@")) {
            setError("Enter a valid email address");
            return;
        }

<<<<<<< HEAD
        const newEntry = { ...form, role, id: uuidv4() };
        const updatedArray = [...passwordArray, newEntry];
        setPasswordArray(updatedArray);
        localStorage.setItem("passwords", JSON.stringify(updatedArray));
        setForm({ email: "", username: "", password: "", confirmpassword: "" });
        setRole(null);

        alert(`Registration Successful as ${role === "lawyer" ? "Lawyer" : "Client"}!`);
=======
        try {
            setLoading(true);
            setError(null);
            
            const response = await loginUser({
                email: form.email,
                password: form.password
            });
            
            // Successful login, redirect based on role
            if (response.role === 'lawyer') {
                navigate('/dashboard/lawyer');
            } else {
                navigate('/dashboard/user');
            }
            
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
    };

    return (
        <div className="flex min-h-screen w-full">
            <div className="w-1/2 flex justify-center items-center p-10">
                <div className="w-96 text-center">
<<<<<<< HEAD
                    <h2 className="text-6xl font-bold mb-14 tracking-tight subpixel-antialiased">REGISTER</h2>

=======
                    <h2 className="text-6xl font-bold mb-14 tracking-tight subpixel-antialiased">LOGIN</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
                    <input
                        value={form.email}
                        onChange={handleChange}
                        placeholder='Enter Email'
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        type="email"
                        name="email"
                    />
<<<<<<< HEAD
                    <input
                        value={form.username}
                        onChange={handleChange}
                        placeholder='Enter Username'
                        className='w-full p-3 mb-6 border border-blue-900 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700'
                        type="text"
                        name="username"
                    />

=======
                    
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
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
<<<<<<< HEAD

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
                        className='w-full mt-4 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-blue-800 transition duration-200'
=======
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='w-full cursor-pointer mt-6 bg-[#0B0B5C] text-white font-bold p-3 rounded-full hover:bg-purple-800 transition duration-200 disabled:bg-gray-400'
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
<<<<<<< HEAD


                    <div className="mt-6 flex space-x-6 justify-center text-[1.2rem]">
                        <p
                            className="text-blue-700 cursor-pointer hover:underline"
                        >
                            <Link to="/signup"> Sign Up</Link>
                        </p>
                        <p
                            s className="text-green-700 cursor-pointer hover:underline"
                        >
                            <Link to="/login"> LogIn as Lawyer</Link>
                        </p>
                    </div>
=======
>>>>>>> 0ed2042838dda0f7f5abcacb801b8b5cdac42484
                </div>
            </div>

            <div
                className="w-1/2 h-screen bg-cover bg-center border-2 border-solid"
                style={{ backgroundImage: "url('/signup.jpg')" }}
            ></div>
        </div >
    );
};

export default Login;
