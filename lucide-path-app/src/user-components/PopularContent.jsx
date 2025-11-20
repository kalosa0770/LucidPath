import React, { useState } from "react";
import placeHolder from '../assets/hub.jpg';
import mindfulness from '../assets/mindfulness.jpg';
import stress from '../assets/stress.jpg';
import { useNavigate } from 'react-router-dom';

const PopularContent = () => {
    const navigate = useNavigate();

    const cardData = [
        {
            title: "How to Use Small Talk to Connect More at Work",
            img: mindfulness,
        },
        {
            title: "The Best Way to Get Through a Tough Day",
            img: stress,
        },
        {
            title: "Depression",
            img: placeHolder,
        },
        {
            title: "All in one",
            img: placeHolder,
        },
    ];

    // Navigate to reading page
    const handleRead = (title) => {
        navigate(`/read-content/${encodeURIComponent(title)}`);
    };

    return (
        <div className="flex flex-col w-full mt-10">
            <div className="mb-1 md:mb-2">
                <h1 className="text-xl md:text-2xl text-gold font-extrabold mb-3 md:mb-4 drop-shadow-lg">
                    Popular on Lucid Path
                </h1>
            </div>

            <div className="flex overflow-x-auto no-scrollbar space-x-4 md:space-x-6">
                {cardData.map((card, index) => (
                    <div key={index} className="flex-shrink-0 w-72 md:w-80">
                        <div className="rounded-2xl">
                            <div className="w-full h-40 md:h-48 overflow-hidden rounded-t-2xl">
                                <img 
                                    src={card.img}
                                    alt={card.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-col items-start mb-3 py-3 px-4 bg-white/10">
                                <h3 className="text-lg md:text-xl text-white">{card.title}</h3>
                                <div className="mt-3 w-full">
                                    <button
                                        onClick={() => handleRead(card.title)}
                                        className="bg-gold text-teal rounded-2xl px-3 py-2 w-full font-extrabold hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        Read
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularContent;
