import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-16 px-8 md:px-20 relative overflow-hidden">
            <div className="absolute left-0 bottom-0 w-full h-full opacity-10 pointer-events-none bg-no-repeat bg-left bg-contain" style={{ backgroundImage: 'url(/tech-bg-left.png)' }}></div>
            <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pointer-events-none bg-no-repeat bg-right bg-contain" style={{ backgroundImage: 'url(/tech-bg-right.png)' }}></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
                <div>
                    <h3 className="font-semibold text-lg mb-3">Address</h3>
                    <p className="text-sm leading-relaxed">
                        LegalEagle, 123 Justice Road, Sector 18, Noida, Uttar Pradesh 201301, India
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-3">Contact</h3>
                    <p className="text-sm">Email: legaleagle@gmail.com</p>
                    <p className="text-sm mt-1">Phone: +91 74040 XXXXX</p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-3">Newsletter</h3>
                    <p className="text-sm mb-4">Stay updated by subscribing to our newsletter</p>
                    <input
                        type="email"
                        placeholder="your.address@email.com"
                        className="w-full px-4 py-2 rounded-full text-black focus:outline-none mb-2"
                    />
                    <button className="w-full bg-[#0B0B5C] hover:bg-[#1c1ca6] text-white font-semibold py-2 rounded-full">
                        Subscribe
                    </button>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-3">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Help</a></li>
                        <li><a href="#" className="hover:underline">Contact us</a></li>
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="#" className="hover:underline">Terms of Service</a></li>
                        <li><a href="#" className="hover:underline">Complaints Policy</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
