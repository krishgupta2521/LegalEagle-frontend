import React from 'react'
import { FileText, Landmark } from 'lucide-react'

const Home = () => {
    return (
        <>
            <div className='grid grid-cols-2 h-[90vh] relative'>
                <div className='grid-cols-1 mx-20 mt-12'>
                    <div className='text-[4.7rem] leading-none text-[#0A0B5C] font-medium'>
                        Your Best <span className='text-[#743714]'>Legal</span><br />
                        Support, Anytime<br />
                        <span className='text-[#743714]'>Anywhere</span>
                    </div>
                    <p className='text-black my-10 text-xl'>
                        We connect citizens with lawyers to tackle legal challenges. Lawyers gain a platform to grow their practice.
                    </p>
                    <div className='flex space-x-4'>
                        <button className='px-5 text-white py-3 bg-[#743714] rounded-full'>Chat Now</button>
                        <button className='px-5 text-white py-2 bg-[#0B0B5C] rounded-full'>Search Legal Info</button>
                    </div>
                </div>

                <div className='grid-cols-2'>
                    <img className='w-full h-full' src='./home.png' alt="Hero" />
                </div>

                <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[-15rem] flex gap-10 z-10'>
                    <div className='bg-white rounded-xl shadow-lg  w-[350px] p-6 text-center'>
                        <FileText className='mx-auto mb-4 text-[#0B0B5C]' size={36} />
                        <h3 className='text-lg font-semibold mb-2'>For Citizens</h3>
                        <p className='text-gray-600 mb-6'>
                            Join our platform to access trusted lawyers and free legal information, empowering you to resolve legal challenges with confidence and ease.
                        </p>
                        <button className='bg-[#0B0B5C] text-white px-6 py-2 rounded-full font-semibold'>
                            Find a Lawyer
                        </button>
                    </div>

                    <div className='bg-white rounded-xl shadow-lg w-[350px] p-6 text-center'>
                        <Landmark className='mx-auto mb-4 text-[#743714]' size={36} />
                        <h3 className='text-lg font-semibold mb-2'>For Law Practitioners</h3>
                        <p className='text-gray-600 mb-6'>
                            Join our network of legal professionals to offer your services, connect with clients, and grow your practice with LegalEagle’s powerful platform.
                        </p>
                        <button className='bg-[#743714] text-white px-6 py-2 rounded-full font-semibold'>
                            Join as a Lawyer
                        </button>
                    </div>
                </div>
            </div>

            <div className='about w-full h-[100vh] bg-zinc-500 bg-opacity-70 relative font-["Nunito"] overflow-hidden'>
                <div className='text-[2rem] text-white tracking-tight absolute bottom-[24.2rem] left-24'>
                    ABOUT US
                </div>
                <div className='absolute w-1/3 bottom-[18rem] left-24 text-[1.2rem] text-white font-["Nunito"]'>
                    LegalEagle was created to revolutionize access to justice by connecting citizens with trusted lawyers and free legal resources through cutting-edge technology.
                </div>
                <div className='absolute w-1/3 bottom-[13rem] left-24 text-[1.2rem] text-white font-["Nunito"]'>
                    We empowers citizens with legal support and lawyers with opportunities to grow in an innovative community.
                </div>
                <div className='absolute w-1/3 bottom-[6.3rem] left-24 text-white text-5xl font-["Mrs_Saint_Delafield"]'>
                    Vinnet Bhatt

                </div>
                <div className='absolute w-1/3 bottom-[5.5rem] left-24 text-white text-xl'>
                    Founder Of Legal Eagle
                </div>

                <div className='absolute w-96 h-96 right-28 bottom-[6rem]'>
                    <img className='object-cover ' src='https://s3-alpha-sig.figma.com/img/65e5/5b10/c1e2f937b540437f50e36fb4102a14de?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pFleVR15AiglBoUu6focM8IMXmyD9fZAlgQJQ3Ov18rWz17dlWeCSAUkeDGULYbz7itjKeGABxNoFsGEQ1Yq7djp5w8DHq47TROc78pCD3RVDWOvIlCyEJ7p6kCICk5qGsGywF8HSIMv-E1jaPPwFdCrZqfii6nKPAcn~JxYCRBwLJfqgd4ywN3Bew7wCO4uhvkycsatcVYVlTIRoFwSkgzn83la07d6lLFykX1ZO5T94aw4nqBINsn3Gso2dIXzGhN8gC~X5udIA22yv~V-q9yxOif9XQZebG7hJ4DPzlO5ItNfcWB17DNSHq8JluFaDE51V3RAhbt4mTRKzWzV9w__'></img>
                </div>
            </div>
            <div className='w-full h-[100vh] bg-white'>
                <div className='w-full flex justify-center relative z-10 -mt-[2rem]'>
                    <div className='bg-white px-8 py-6 w-[90%] max-w-7xl'>
                        <div className='text-2xl font-bold text-[#0B0B5C] mb-6'>
                            CHOOSE YOUR LAWYER
                            <div className='w-10 h-[3px] bg-[#0B0B5C] mt-1'></div>
                        </div>

                        <div className='flex gap-6 overflow-x-auto scrollbar-hide'>
                            {[
                                { name: 'Adv. Rashmi Gupta', exp: '10 yrs', img: './lawyer1.jpg' },
                                { name: 'Adv. Rahul Nohwal', exp: '35 yrs', img: './lawyer2.jpg' },
                                { name: 'Adv. Shweta Ranjan', exp: '5 yrs', img: './lawyer3.jpg' },
                                { name: 'Adv. Rashmi Gupta', exp: '12 yrs', img: './lawyer4.jpg' },
                                { name: 'Adv. Ravinder Gupta', exp: '20 yrs', img: './lawyer5.jpg' },
                                { name: 'Adv. Rashmi Gupta', exp: '30 yrs', img: './lawyer6.jpg' },
                            ].map((lawyer, idx) => (
                                <div key={idx} className='bg-[#F7F7FB] rounded-xl p-4 text-center min-w-[160px] shadow-md'>
                                    <img src={lawyer.img} alt={lawyer.name} className='w-24 h-24 rounded-full mx-auto object-cover mb-3' />
                                    <h4 className='font-semibold text-[#0B0B5C] text-sm'>{lawyer.name}</h4>
                                    <p className='text-sm mt-1'>Exp: {lawyer.exp}</p>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-end mt-4'>
                            <button className='bg-[#743714] text-white px-4 py-1 rounded-full text-sm'>
                                More
                            </button>
                        </div>
                    </div>
                </div>
            </div>




        </>
    )
}

export default Home
