import React from 'react'
import { FileText, Landmark } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className='bg-[#F5F5F5]'>
            <div className='grid grid-cols-2 h-[90vh] relative bg-white'>
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
                    <img className='w-[90vh] h-[80vh]' src='./home.png' alt="Hero" />
                </div>

                <div className='absolute left-1/2 transform -translate-x-1/2 bottom-[-15rem] flex gap-10 z-10'>
                    <div className='bg-white rounded-xl shadow-lg  w-[350px] p-6 text-center'>
                        <FileText className='mx-auto mb-4 text-[#0B0B5C]' size={36} />
                        <h3 className='text-lg font-semibold mb-2'>For Citizens</h3>
                        <p className='text-gray-600 mb-6'>
                            Join our platform to access trusted lawyers and free legal information, empowering you to resolve legal challenges with confidence and ease.
                        </p>
                        <Link to="/lawyer">
                            <button className="bg-[#0B0B5C] text-white px-6 py-2 rounded-full font-semibold">
                                Find a Lawyer
                            </button>
                        </Link>

                    </div>

                    <div className='bg-white rounded-xl shadow-lg w-[350px] p-6 text-center'>
                        <Landmark className='mx-auto mb-4 text-[#743714]' size={36} />
                        <h3 className='text-lg font-semibold mb-2'>For Law Practitioners</h3>
                        <p className='text-gray-600 mb-6'>
                            Join our network of legal professionals to offer your services, connect with clients, and grow your practice with LegalEagle’s powerful platform.
                        </p>
                        <Link to="/lawyerregister">
                            <button className='bg-[#743714] text-white px-6 py-2 rounded-full font-semibold'>
                                Join as a Lawyer
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='about w-full h-[100vh] bg-zinc-500 bg-opacity-70 relative font-["Nunito"] overflow-hidden'
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1535905748047-14b2415c77d5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFyayUyMGxpYnJhcnl8ZW58MHx8MHx8fDA%3D")',
                    }}
                />
                <div className='text-[2rem] text-white tracking-tight absolute bottom-[24.2rem] left-24'>
                    ABOUT US
                </div>
                <div className='absolute w-1/3 bottom-[18rem] left-24 text-[1.2rem] text-white font-["Nunito"]'>
                    LegalEagle was created to revolutionize access to justice by connecting citizens with trusted lawyers and free legal resources through cutting-edge technology.
                </div>
                <div className='absolute w-1/3 bottom-[13rem] left-24 text-[1.2rem] text-white font-["Nunito"]'>
                    We empower citizens with legal support and lawyers with opportunities to grow in an innovative community.
                </div>
                <div className='absolute w-1/3 bottom-[6.3rem] left-24 text-white text-5xl font-["Mrs_Saint_Delafield"]'>
                    Vinnet Bhatt
                </div>
                <div className='absolute w-1/3 bottom-[5.4rem] left-24 text-white text-xl'>
                    Founder Of Legal Eagle
                </div>

                <div className='absolute w-96 h-96 right-28 bottom-[7rem]'>
                    <img className='object-cover rounded-xl' src='https://s3-alpha-sig.figma.com/img/65e5/5b10/c1e2f937b540437f50e36fb4102a14de?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pFleVR15AiglBoUu6focM8IMXmyD9fZAlgQJQ3Ov18rWz17dlWeCSAUkeDGULYbz7itjKeGABxNoFsGEQ1Yq7djp5w8DHq47TROc78pCD3RVDWOvIlCyEJ7p6kCICk5qGsGywF8HSIMv-E1jaPPwFdCrZqfii6nKPAcn~JxYCRBwLJfqgd4ywN3Bew7wCO4uhvkycsatcVYVlTIRoFwSkgzn83la07d6lLFykX1ZO5T94aw4nqBINsn3Gso2dIXzGhN8gC~X5udIA22yv~V-q9yxOif9XQZebG7hJ4DPzlO5ItNfcWB17DNSHq8JluFaDE51V3RAhbt4mTRKzWzV9w__' alt="Founder" />
                </div>
            </div>

            <div className='w-full flex justify-center relative z-20 -mt-10'>
                <div className='bg-white shadow-xl rounded-2xl px-8 py-6 w-[90%] max-w-7xl'>
                    <div className='text-2xl font-bold text-[#0B0B5C] mb-6'>
                        CHOOSE YOUR LAWYER
                        <div className='w-10 h-[3px] bg-[#0B0B5C] mt-1'></div>
                    </div>

                    <div className='flex gap-6 overflow-x-auto scrollbar-hide pb-2'>
                        {[
                            { name: 'Adv. Rashmi Gupta', exp: '10 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Rahul Nohwal', exp: '35 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Shweta Ranjan', exp: '5 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Rashmi Gupta', exp: '12 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Ravinder Gupta', exp: '20 yrs', img: './lawyer1.jpg' },
                            { name: 'Adv. Rashmi Gupta', exp: '30 yrs', img: './lawyer1.jpg' },
                        ].map((lawyer, idx) => (
                            <div key={idx} className='bg-[#F7F7FB] rounded-xl p-4 text-center min-w-[180px] shadow-md'>
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

            <div className='service w-full h-[100vh] bg-[#F5F5F5] bg-opacity-70 relative font-["Nunito"] overflow-hidden mb-4'>
                <div className='text-3xl font-bold text-[#0B0B5C] mb-6 mx-20 my-20'>
                    OUR SERVICES
                    <div className='w-10 h-[3px] bg-[#0B0B5C] mt-1'></div>
                </div>
                <div className='px-20'>
                    <p className='text-2xl'>
                        LegalEagle provides citizens with lawyer consultations and free legal clause access, while enabling lawyers to deliver services and expand their reach.
                    </p>
                </div>
                <div className='flex mx-10 my-20 justify-center items-center gap-20'>
                    <div className='h-[60vh] w-[40vh] bg-[#743714] rounded-[12vh] overflow-hidden'>
                        <img className='object-cover h-[50vh]' src='https://s3-alpha-sig.figma.com/img/ebcd/4ef7/02bd3a527efd4bc03cdbc31e69fa8c7c?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=KUHdRSBWavzRTO7XL8m4QKvRDBkxfqnU27N3K7gCxLBZu6i8bNqX~WH6R0W4X9VMYQjIwjGAHa8wl2WCKjUtI1qbnYmy9at9FUGz0288qQxyjho-pJK5EbMN7ZRLNATloO-FQEEaPGfO~Gvbx~bAZ~uhferv3iYK1eUgt-qOIiq2e5NRIr04KMqjgM7V8aVgoYnK0JftF~AjvFYh7lJG5HrVKNLEBOEhJrFtR3l73dHte801jLQFWzpI2RQWcpYln4WPBLjueL9K7l0qd68MNN9xe7gCGWgbA1sus2xw8e7~~RlScK4QX5cxDnatGL-ib6Uhb1xx3DuTGrLfMdX-Jg__'>
                        </img>
                        <div className='text-center font-bold my-3 text-white text-xl'>
                            LEGAL<br /> SIMPLIFIER
                        </div>
                    </div>

                    <div className='h-[60vh] w-[40vh] bg-[#743714] rounded-[12vh] overflow-hidden'>
                        <img className='object-cover h-[50vh]' src='https://s3-alpha-sig.figma.com/img/4bbc/ec93/e24ebd8487ef2a67da9b67c7517eb8d3?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tQa9m~oaKXlAQFJvjuwAdKpVQdIjIOnGUVV~pDUxahdxfN-R2heMvW4ud-OEL7jWUzoRjpcx-8ayPDdsDxD44DnHgvrfxbhO5CKu9jLCCBaezFhy6AqEXJrNqvv8~xG2hYu3yhFq03Fdcy15mH2MlU89-c8q3TEYF2KYNZYUkEzebua7yYqz0jx7elh4FEyRYwVlZyrtHKpmAnghlAhgBsAC6XzFrmY900rhMNKnvxHW1rZZIdQXGtCtHQ~sWvpR7nke7DDsG7ku3~Ttc80tl8GBEwLDYhSNrkr-mPr8GOkpXQFF9k3nDhh0n0L0Cq8TkjB1mvyBY5iNgu4Zjumbww__'>
                        </img>
                        <div className='text-center font-bold my-3 text-white text-xl'>
                            NOTARY<br /> SERVICE
                        </div>
                    </div>

                    <div className='h-[60vh] w-[40vh] bg-[#743714] rounded-[12vh] overflow-hidden'>
                        <img className='object-cover h-[50vh]' src='https://s3-alpha-sig.figma.com/img/3399/5f25/cb6bfaf99a8658383012ae606b977c6a?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oe0IjtFZ2khJBLqi9hm6BzK65kVvdZ~MNeqf9c69OEzrBHGVXUFY57v1qgGClMXhCTXTr5GigfFHYvIaNCcikF0IG6feLQHCBaSQ7ws~J~P~YaRygPkG4a~eHWByvrMwmbycuug5UMCG8N2DdIBcuyvsQHfO4hEDE20ARAF0dYsiKaxtJgs3wRbjo6WXlWnEDatJsNhRzOONlJMt9Z0s4Jawo1bbZ7B5Wv7gUxOci9999CV98GcLfWEpRvI3wJ2V4jDLQQvIQiPqlFZxWsia~CozX3o-pZzomCUKnfjTKQI-MkrqG-9d2IURWMQ0H2mIS~4NSuLpWhOnHt4WGwcFgA__'>
                        </img>
                        <div className='text-center font-bold my-3 text-white text-xl'>
                            CASE<br /> STATUS
                        </div>
                    </div>

                </div>
            </div>

            <div className='review w-full h-[100vh] bg-white'>
                <div className='flex flex-col md:flex-row justify-between items-center h-full px-20'>
                    <div className='md:w-1/2 space-y-6'>
                        <h2 className='text-4xl font-bold text-black'>What Our Customers Say About Our Services</h2>

                        <div className='flex items-start mt-4'>
                            <div className='text-[#743714] text-7xl mr-4'>“</div>
                            <p className='text-xl text-gray-700'>
                                LegalEagle’s platform made filing my consumer court case seamless, with expert lawyer support and clear guidance!
                            </p>
                        </div>

                        <div className='flex items-center mt-4'>
                            <div className='w-14 h-14 bg-gray-300 rounded-full mr-4'></div>
                            <div>
                                <p className='font-semibold text-xl underline text-[#0B0B5C]'>Isha Ranjan</p>
                                <p className='text-lg text-gray-600'>Employee</p>
                                <div className='flex space-x-1 mt-1'>
                                    <div className='w-6 h-1 bg-[#0B0B5C]'></div>
                                    <div className='w-4 h-1 bg-[#0B0B5C]'></div>
                                    <div className='w-3 h-1 bg-[#0B0B5C]'></div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-6'>
                            <p className='font-semibold text-xl mb-2'>Also Visit:</p>
                            <div className='flex items-center space-x-6'>
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWJpwUvZMFKp_kXyJA2yd8zulrzNfK4ZIOgQ&s' alt='Google Reviews' className='h-12' />
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9CVhYA05o_Z5aXnRGHavP7ywRi7KC9mZPUg&s' alt='Clutch Reviews' className='h-10' />
                            </div>
                        </div>
                    </div>

                    <div className='md:w-1/2 flex justify-center mt-10 md:mt-0'>
                        <img
                            src='https://s3-alpha-sig.figma.com/img/92cf/35a2/0db02b938c276057b3f112958aeb7957?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YWEYO2i8DshElYua6-7Rz26fuam11U0bPmY3WYcGzQ0O9B~0qXZOutc-pKrn1SiezfSJIP~CrTHEuvgI3ifpYfQ7m8L-uPlxWCOSfIqCkZ4kECh0J8zKgQ2vbxEEB0tySavoBNU2uUoMbDHOWvyQnddJMrsDjNnlQ3sHg5D6mBlvFbQqWHsqDHptZdToMViGd~vp5Ah9bMvR98tsUSQ46n1uQ1InJJguPKHP1djEOMaw4EhfYna5~BZ0Yp7dsfUiMhSfodRqmLAmU2KVgWF9UapgcmiRzDoWPMO8S4wfxRB1QLtdeNG5gKj-UHAy8AIeQBbvuNy76~a1qmpVKOMM8w__'
                            alt='Happy Customers'
                            className='rounded-lg w-full max-w-md object-cover h-[50vh]'
                        />
                    </div>
                </div>

            </div>

        </div >
    )
}

export default Home
