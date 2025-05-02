import React from "react";
import {
    Phone,
    Mail,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="w-full">
            <div className="bg-[#0B0B5C] text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Phone size={16} />
                            <span>+91 74040 XXXXX</span>
                        </div>
                        <span className="text-xl">·</span>
                        <div className="flex items-center space-x-1">
                            <Mail size={16} />
                            <span>legaleagle@gmail.com</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex space-x-3">
                            <Facebook size={16} />
                            <Twitter size={16} />
                            <Linkedin size={16} />
                            <Instagram size={16} />
                        </div>
                        <button className="bg-white text-black font-semibold px-4 py-4 rounded-sm">
                            Buy Prime Membership
                        </button>
                    </div>
                </div>
            </div>

            <header className="w-full">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src="https://s3-alpha-sig.figma.com/img/20f5/6af6/75e624743590a6a6abc9861d08bc2e28?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eqDDS~pWI-fQtD6eNGlBlzueTolXEX5gVYBW8Uv-imWAHkJTMksnskMiMdfkT~t0rVgCo0f3bppDkZ57pgyhmvx~6PW0DbZLpB2CBIbwOYlSYq5zBKowTz3a1DL3zD8xSFhP5CYL-ayL5rhueChfgQnqBsjbopLl9my4lmcryOvzP0TSmXAuDxYeSS8cmFrnALv-gN574TbOWdHXuJPVDYMLDC0SUHkeDf3spoUVSY9S1qQLUVjipadZtQVC5GNoZOcg2vOApc2joAz9dNGcBottCcw2mue1ckNS5akZl5kVzSutelzO-W0q4aDkZ83Fp4u~Hh6~jefrO6OO2MUiDw__"
                            alt="Logo"
                            className="h-16 w-16"
                        />
                        <span className="text-3xl font-bold font-['Righteous'] text-[#0B0B5C]">
                            Legal Eagle
                        </span>
                    </div>

                    <nav className="hidden md:flex space-x-8 font-medium text-[#0B0B5C]">
                        <a href="#" className="hover:underline">Our Services</a>
                        <a href="#" className="hover:underline">About Us</a>
                        <a href="#" className="hover:underline">Contact Us</a>
                        <a href="#" className="hover:underline">More</a>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <button className="flex items-center text-[#0B0B5C] font-semibold space-x-2">
                                Sign Up
                            </button>
                        </Link>

                        <div className="border border-[#0B0B5C] rounded-full p-1">
                            <ArrowUpRight size={16} />
                        </div>

                        <button className="bg-[#683B14] text-white font-medium px-6 py-2 rounded-full">
                            Contact Us
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}
