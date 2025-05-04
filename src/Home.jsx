import React, { useEffect } from 'react';
import { FileText, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tilt } from 'react-tilt';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <div className="bg-[#F5F5F5]">
            <div className="grid grid-cols-2 h-[90vh] relative bg-white">
                <div className="grid-cols-1 mx-20 mt-12" data-aos="fade-right">
                    <Tilt>
                        <div className="text-[4.7rem] leading-none text-[#0A0B5C] font-medium">
                            Your Best <span className="text-[#743714]">Legal</span>
                            <br />
                            Support, Anytime
                            <br />
                            <span className="text-[#743714]">Anywhere</span>
                        </div>
                    </Tilt>

                    <p className="text-black my-10 text-xl" data-aos="fade-up">
                        We connect citizens with lawyers to tackle legal challenges. Lawyers gain a platform to grow their practice.
                    </p>
                    <div className="flex space-x-4">
                        <button className="px-5 text-white py-3 bg-[#743714] rounded-full">Chat Now</button>
                        <button className="px-5 text-white py-2 bg-[#0B0B5C] rounded-full">Search Legal Info</button>
                    </div>
                </div>

                <div className="grid-cols-2" data-aos="fade-left">
                    <img className="w-[90vh] h-[80vh]" src="./home.png" alt="Hero" />

                </div>

                <div
                    className="absolute left-80 transform bottom-[-15rem] flex gap-10 z-10"
                    data-aos="fade-up"
                >
                    <Tilt>
                        <div className="bg-white rounded-xl shadow-lg w-[350px] p-6 text-center">
                            <FileText className="mx-auto mb-4 text-[#0B0B5C]" size={36} />
                            <h3 className="text-lg font-semibold mb-2">For Citizens</h3>
                            <p className="text-gray-600 mb-6">
                                Join our platform to access trusted lawyers and free legal information, empowering you to resolve legal challenges with confidence and ease.
                            </p>
                            <Link to="/lawyer">
                                <button className="bg-[#0B0B5C] text-white px-6 py-2 rounded-full font-semibold">
                                    Find a Lawyer
                                </button>
                            </Link>
                        </div>
                    </Tilt>

                    <Tilt>
                        <div className="bg-white rounded-xl shadow-lg w-[350px] p-6 text-center">
                            <Landmark className="mx-auto mb-4 text-[#743714]" size={36} />
                            <h3 className="text-lg font-semibold mb-2">For Law Practitioners</h3>
                            <p className="text-gray-600 mb-6">
                                Join our network of legal professionals to offer your services, connect with clients, and grow your practice with LegalEagle’s powerful platform.
                            </p>
                            <Link to="/lawyerregister">
                                <button className="bg-[#743714] text-white px-6 py-2 rounded-full font-semibold">
                                    Join as a Lawyer
                                </button>
                            </Link>
                        </div>

                    </Tilt>
                </div>
            </div>

            <div
                className="about w-full h-[100vh] bg-zinc-500 bg-opacity-70 relative font-['Nunito'] overflow-hidden"
                data-aos="fade-up"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1535905748047-14b2415c77d5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFyayUyMGxpYnJhcnl8ZW58MHx8MHx8fDA%3D")',
                    }}
                />
                <div className="text-[2rem] text-white tracking-tight absolute bottom-[24.2rem] left-24">
                    ABOUT US
                </div>
                <div className="absolute w-1/3 bottom-[18rem] left-24 text-[1.2rem] text-white font-['Nunito']">
                    LegalEagle was created to revolutionize access to justice by connecting citizens with trusted lawyers and free legal resources through cutting-edge technology.
                </div>
                <div className="absolute w-1/3 bottom-[13rem] left-24 text-[1.2rem] text-white font-['Nunito']">
                    We empower citizens with legal support and lawyers with opportunities to grow in an innovative community.
                </div>
                <div className="absolute w-1/3 bottom-[6.3rem] left-24 text-white text-5xl font-['Mrs_Saint_Delafield']">
                    Bugged
                </div>
                <div className="absolute w-1/3 bottom-[5.4rem] left-24 text-white text-xl">
                    Founder Of Legal Eagle
                </div>

                <div className="absolute w-96 h-96 right-28 bottom-[7rem]" data-aos="fade-left">
                    <img
                        className="object-cover rounded-xl"
                        src="./founder.png"
                        alt="Founder"
                    />
                </div>
            </div>

            <div
                className="w-full flex justify-center relative z-20 -mt-10"
                data-aos="fade-up"
            >
                <div className="bg-white shadow-xl rounded-2xl px-8 py-6 w-[90%] max-w-7xl">
                    <div className="text-2xl font-bold text-[#0B0B5C] mb-6">
                        CHOOSE YOUR LAWYER
                        <div className="w-10 h-[3px] bg-[#0B0B5C] mt-1"></div>
                    </div>

                    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
                        {[
                            { name: 'Adv. Rashmi Gupta', exp: '10 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Rahul Nohwal', exp: '35 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Shweta Ranjan', exp: '5 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Rashmi Gupta', exp: '12 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Ravinder Gupta', exp: '20 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Rashmi Gupta', exp: '30 yrs', img: './lawyer1.jpg' },
                        ].map((lawyer, idx) => (
                            <div
                                key={idx}
                                className="bg-[#F7F7FB] rounded-xl p-4 text-center min-w-[180px] shadow-md"
                                data-aos="fade-up"
                            >
                                <img
                                    src={lawyer.img}
                                    alt={lawyer.name}
                                    className="w-24 h-24 rounded-full mx-auto object-cover mb-3"
                                />
                                <h4 className="font-semibold text-[#0B0B5C] text-sm">{lawyer.name}</h4>
                                <p className="text-sm mt-1">Exp: {lawyer.exp}</p>
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            <div
                className="service w-full h-[100vh] bg-[#F5F5F5] bg-opacity-70 relative font-['Nunito'] overflow-hidden mb-4"
                data-aos="fade-up"
            >
                <div className="text-3xl font-bold text-[#0B0B5C] mb-6 mx-20 my-20">
                    OUR SERVICES
                    <div className="w-10 h-[3px] bg-[#0B0B5C] mt-1"></div>
                </div>
                <div className="px-20">
                    <p className="text-2xl">
                        LegalEagle provides citizens with lawyer consultations and free legal clause access, while enabling lawyers to deliver services and expand their reach.
                    </p>
                </div>
                <div className="flex mx-10 my-20 justify-center items-center gap-20">
                    <div className="h-[60vh] w-[40vh] bg-[#743714] rounded-[12vh] overflow-hidden" data-aos="fade-up">
                        <img
                            className="object-cover h-[50vh]"
                            src="./image1.jpg"
                            alt="Service Image"
                        />
                        <div className="p-5 text-center">
                            <p className="text-white text-xl">Find a Lawyer</p>
                        </div>
                    </div>

                    <div className="h-[60vh] w-[40vh] bg-[#743714] rounded-[12vh] overflow-hidden" data-aos="fade-up">
                        <img
                            className="object-cover h-[50vh]"
                            src="./image2.jpg"
                            alt="Service Image"
                        />
                        <div className="p-5 text-center">
                            <p className="text-white text-xl">Legal Clause Access</p>
                        </div>
                    </div>
                    <div className="h-[60vh] w-[40vh] bg-[#743714] rounded-[12vh] overflow-hidden" data-aos="fade-up">
                        <img
                            className="object-cover h-[50vh]"
                            src="./image3.jpg"
                            alt="Service Image"
                        />
                        <div className="p-5 text-center">
                            <p className="text-white text-xl">Legal Clause</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
