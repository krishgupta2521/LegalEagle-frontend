import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const lawyers = [
    {
        name: 'Adv. Rashmi Gupta',
        experience: '15 yrs',
        location: 'Govind Nagar, Nashik',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvdHJhaXR8ZW58MHx8MHx8fDA%3D',
        expertise: [
            'Insurance', 'Arbitration', 'Recovery', 'Bankruptcy', 'Cheque Bounce',
            'Cyber Crime', 'Consumer Court', 'Breach', 'Child Custody', 'Divorce',
            'Criminal', 'Motor Accident', 'Property', 'Anticipatory Bail', 'Domestic Violence'
        ],
        rating: 4.5,
        reviews: '100+ ratings'
    },
    {
        name: 'Adv. Harry',
        experience: '10 yrs',
        location: '',
        image: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvdHJhaXR8ZW58MHx8MHx8fDA%3D',
        expertise: ['Insurance', 'Arbitration', 'Recovery', 'Bankruptcy', 'Cheque Bounce',
            'Cyber Crime', 'Consumer Court', 'Breach', 'Child Custody', 'Divorce',
            'Criminal', 'Motor Accident', 'Property', 'Anticipatory Bail', 'Domestic Violence'],
        rating: 4.2,
        reviews: '80+ ratings'
    },
    {
        name: 'Adv. Sakshi',
        experience: '10 yrs',
        location: '',
        image: 'https://plus.unsplash.com/premium_photo-1668896122605-debd3fed81a4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBvdHJhaXR8ZW58MHx8MHx8fDA%3D',
        expertise: ['Insurance', 'Arbitration', 'Recovery', 'Bankruptcy', 'Cheque Bounce',
            'Cyber Crime', 'Consumer Court', 'Breach', 'Child Custody', 'Divorce',
            'Criminal', 'Motor Accident', 'Property', 'Anticipatory Bail', 'Domestic Violence'],
        rating: 4.2,
        reviews: '80+ ratings'
    },
    {
        name: 'Adv. Sam',
        experience: '10 yrs',
        location: '',
        image: 'https://images.unsplash.com/photo-1625642123545-f0f68b1621e3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvdHJhaXR8ZW58MHx8MHx8fDA%3D',
        expertise: ['Insurance', 'Arbitration', 'Recovery', 'Bankruptcy', 'Cheque Bounce',
            'Cyber Crime', 'Consumer Court', 'Breach', 'Child Custody', 'Divorce',
            'Criminal', 'Motor Accident', 'Property', 'Anticipatory Bail', 'Domestic Violence'],
        rating: 4.2,
        reviews: '80+ ratings'
    },

];

export default function LawyerPage() {
    const [selected, setSelected] = useState(lawyers[0]);

    return (
        <div className="min-h-screen text-black">
            <div
                className="bg-cover bg-center py-16 px-10 border-b border-gray-200"
                style={{
                    backgroundImage: 'url("https://s3-alpha-sig.figma.com/img/c972/0c25/51f069bca35d020c6973af94119b27da?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=X07vvrpByVjxYLrCUWl3MavP1EbG96UxUU~OZBNpelJGziCcyXh-u0emw~2jBK2OF5BYWgbTmiYSnwRgfPD-Na3PRWec1ndxpahccBQW4S~6sVp3a4XXn1Ts4ojcYWmj9bOb3ophBiznqqSiRtAFhq6fxXz2bkuYz-bdJns5AbUY2aLe2RR8va6AwgXQbD8Imf4yRq6HvSxw1Doa9K0QHuEmawd4YYqsKtcWyLvXxPNcydXKE0UWXs4R5mBbkuBRm1KaNDtjEGM7UrG2GeHhKXpDjwBa~9PhaB~yLCUkbrtk3lY~g0ZI6pni04PdCv7zcNHbUbwyT2FXIMlMje8gcA__")',
                }}
            >
                <h1 className="text-5xl font-bold leading-tight text-white">
                    Book Your <span className="text-[#0B0B5C]">Trusted Lawyer</span>, – Expert Help Just a Click Away
                </h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl -mt-10 mx-10 flex justify-around items-center text-black relative z-10">
                <input className="border px-4 py-2 rounded w-1/4" placeholder="Area of Law" />
                <input className="border px-4 py-2 rounded w-1/4" placeholder="Years of Experience" />
                <input className="border px-4 py-2 rounded w-1/4" placeholder="Select Location" />
                <button className="bg-[#0B0B5C] text-white px-6 py-2 rounded-full font-semibold">Search Lawyer</button>
            </div>

            <div className="px-10 mt-16">
                <h2 className="text-[#0B0B5C] font-semibold text-xl mb-4">CHOOSE YOUR LAWYER</h2>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {lawyers.map((lawyer, index) => (
                        <div
                            key={index}
                            className="bg-white text-black rounded-xl p-4 w-52 cursor-pointer shadow hover:shadow-lg"
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
                            <p className="text-center">Exp: {lawyer.experience}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white mt-16 mx-10 p-8 rounded-xl text-black">
                <div className="flex items-center gap-6">
                    <div className="h-28 w-28 rounded-full bg-gray-300">
                        {selected.image ? (
                            <img src={selected.image} alt={selected.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gray-400 rounded-full text-white">
                                No Image
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Advocate {selected.name.split(' ')[1]} {selected.name.split(' ')[2]}</h2>
                        <p className="text-sm">Location - {selected.location || 'Not specified'}</p>
                        <p className="text-sm">Experience - {selected.experience}</p>
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
                    {selected.expertise.map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-white border border-[#0B0B5C] text-[#0B0B5C] rounded-full text-sm">
                            {item}
                        </span>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link to={{ pathname: '/chat', state: { name: selected.name, image: selected.image } }}>
                        <button className="bg-[#0B0B5C] text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:shadow-lg">
                            Chat Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
