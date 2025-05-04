import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLawyers } from './utils/api';

export default function LawyerPage() {
    const [lawyers, setLawyers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLawyers = async () => {
            try {
                setIsLoading(true);
                const data = await fetchLawyers();
                console.log("API response:", data);

                if (!data || data.length === 0) {
                    setError('No lawyer data available at the moment.');
                    setLawyers([]);
                    setSelected(null);
                    return;
                }

                const transformedData = data.map(lawyer => ({
                    id: lawyer._id,
                    name: lawyer.name || 'Unknown Lawyer',
                    experience: lawyer.experience ? `${lawyer.experience} yrs` : 'Not specified',
                    specialization: lawyer.specialization || 'General Practice',
                    pricePerSession: lawyer.pricePerSession || 0,
                    location: lawyer.location || 'Not specified',
                    image: lawyer.profilePicture || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvdHJhaXR8ZW58MHx8MHx8fDA%3D',
                    expertise: lawyer.specialization ? [lawyer.specialization] : ['General Practice'],
                    rating: (lawyer.rating && lawyer.rating.average) || 4.0,
                    reviews: (lawyer.rating && lawyer.rating.count) ? `${lawyer.rating.count}+ ratings` : '50+ ratings',
                    email: lawyer.email || '',
                    phone: lawyer.phone || '',
                }));

                console.log("Transformed data:", transformedData); // Debug log

                setLawyers(transformedData);
                if (transformedData.length > 0) {
                    setSelected(transformedData[0]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching lawyers:', err);
                setError('Failed to load lawyers. The service might be unavailable.');
                setLawyers([]);
                setSelected(null);
            } finally {
                setIsLoading(false);
            }
        };

        getLawyers();
    }, []);

    const handleSearch = () => {
        console.log("Search functionality to be implemented");
    };

    const renderLawyerGrid = () => {
        if (lawyers.length === 0) {
            return (
                <div className="text-center py-10 text-gray-500">
                    No lawyers available at this time.
                </div>
            );
        }

        return (
            <div className="flex gap-6 overflow-x-auto pb-4">
                {lawyers.map((lawyer, index) => (
                    <div
                        key={lawyer.id || index}
                        className="bg-white text-black rounded-xl p-4 w-60 min-w-60 cursor-pointer shadow hover:shadow-lg"
                        onClick={() => setSelected(lawyer)}
                    >
                        <div className="h-40 bg-gray-200 rounded-lg mb-3">
                            {lawyer.image ? (
                                <img src={lawyer.image} alt={lawyer.name} className="h-full w-full object-cover rounded-lg" />
                            ) : (
                                <div className="h-full w-full bg-gray-400 flex items-center justify-center text-white rounded-lg">
                                    No Image
                                </div>
                            )}
                        </div>
                        <h4 className="font-semibold text-center">{lawyer.name}</h4>
                        <p className="text-sm text-center text-gray-600">{lawyer.specialization}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Exp: {lawyer.experience}</span>
                            <span className="text-sm font-semibold text-[#0B0B5C]">₹{lawyer.pricePerSession}/session</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen text-black">
            <div
                className="bg-cover bg-center py-16 px-10 border-b border-gray-200 opacity-90"
                style={{
                    backgroundImage: 'url("https://s3-alpha-sig.figma.com/img/c972/0c25/51f069bca35d020c6973af94119b27da?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=X07vvrpByVjxYLrCUWl3MavP1EbG96UxUU~OZBNpelJGziCcyXh-u0emw~2jBK2OF5BYWgbTmiYSnwRgfPD-Na3PRWec1ndxpahccBQW4S~6sVp3a4XXn1Ts4ojcYWmj9bOb3ophBiznqqSiRtAFhq6fxXz2bkuYz-bdJns5AbUY2aLe2RR8va6AwgXQbD8Imf4yRq6HvSxw1Doa9K0QHuEmawd4YYqsKtcWyLvXxPNcydXKE0UWXs4R5mBbkuBRm1KaNDtjEGM7UrG2GeHhKXpDjwBa~9PhaB~yLCUkbrtk3lY~g0ZI6pni04PdCv7zcNHbUbwyT2FXIMlMje8gcA__")',
                }}
            >
                <h1 className="text-5xl font-extrabold leading-tight text-white">
                    Book Your <span className="text-[#0B0B5C]">Trusted Lawyer</span>, – Expert Help Just a Click Away
                </h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl -mt-10 mx-10 flex justify-around items-center text-black relative z-10">
                <input className="border px-4 py-2 rounded w-1/4" placeholder="Area of Law" />
                <input className="border px-4 py-2 rounded w-1/4" placeholder="Years of Experience" />
                <input className="border px-4 py-2 rounded w-1/4" placeholder="Select Location" />
                <button onClick={handleSearch} className="bg-[#0B0B5C] text-white px-6 py-2 rounded-full font-semibold">Search Lawyer</button>
            </div>

            {/* First component: Lawyer listing section */}
            <div className="px-10 mt-16">
                <h2 className="text-[#0B0B5C] font-semibold text-xl mb-4">CHOOSE YOUR LAWYER</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B0B5C]"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : (
                    renderLawyerGrid()
                )}
            </div>

            {/* Second component: Selected lawyer details section */}
            <div className="mt-16 mx-10 mb-16">
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B0B5C]"></div>
                    </div>
                ) : !selected && !error ? (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">No lawyer selected. Please choose a lawyer from the list above.</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">Cannot display lawyer details: {error}</span>
                    </div>
                ) : selected && (
                    <div className="bg-white p-8 rounded-xl text-black shadow-md">
                        <div className="flex items-center gap-6">
                            <div className="h-28 w-28 rounded-full bg-gray-300 overflow-hidden">
                                {selected.image ? (
                                    <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full bg-gray-400 text-white">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Advocate {selected.name}</h2>
                                <p className="text-sm">Location - {selected.location}</p>
                                <p className="text-sm">Experience - {selected.experience}</p>
                                <p className="text-sm font-medium mt-1">Price - <span className="text-[#0B0B5C] font-semibold">₹{selected.pricePerSession}</span> per session</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-[#0B0B5C] text-white text-xs px-2 py-1 rounded">{selected.rating} ★</span>
                                    <span className="text-xs text-gray-600">{selected.reviews}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-6 font-semibold text-sm">
                            <button className="text-[#0B0B5C]">Expertise</button>
                            <button>Profile</button>
                            <button>Top Review</button>
                            <button>Answers</button>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            {selected.expertise && selected.expertise.map((item, i) => (
                                <span key={i} className="px-4 py-2 bg-white border border-[#0B0B5C] text-[#0B0B5C] rounded-full text-sm">
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h3 className="text-md font-semibold">Contact Information</h3>
                            {selected.email && <p className="text-sm mt-1">Email: {selected.email}</p>}
                            {selected.phone && <p className="text-sm mt-1">Phone: {selected.phone}</p>}
                        </div>

                        <div className="mt-10 text-center">
                            <Link
                                to="/chat"
                                state={{ lawyerId: selected.id, name: selected.name, image: selected.image }}
                                className="bg-[#0B0B5C] text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:shadow-lg inline-block"
                            >
                                Chat Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
