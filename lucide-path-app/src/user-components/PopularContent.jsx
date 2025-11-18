import React, {useState} from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import placeHolder from '../assets/hub.jpg';
import mindfulness from '../assets/mindfulness.jpg';
import stress from '../assets/stress.jpg';


const PopularContent = () => {
    const [read, setRead] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const readContent = () => {
        setRead(!read);
        setOpenModal(true);
    }
    
    const cardData = [
        {
            title: "How to",
            text: "The mind is the greatest assest of a human-being. Get started to know how to.",
            img: mindfulness, 
            accentColor: 'text-orange-400',
            btn: <button className="px-5 md:px-6 py-2 md:py-3 bg-teal-500 text-white rounded-lg 
            hover:bg-teal-600 transition-all duration-200 
            transform hover:scale-105 self-start text-sm md:text-base
            border border-teal-600 hover:border-teal-700 shadow-md" onClick={readContent}>Read</button>
        },
        {
            title: "Stress",
            text: "Unlock your inner control, take hold of your stressors today through our curated resources.",
            img: stress,
            accentColor: 'text-emerald-400'
        },
        {
            title: "Depression",
            text: "Dont be a target for mental distress. Know how to handle depression in these five steps",
            img: placeHolder,
            accentColor: 'text-orange-400'
        },
        {
            title: "All in one",
            text: "Offering healthcare through our curated resources to take hold of your daily stressors.",
            img: placeHolder,
            accentColor: 'text-emerald-400'
        },
    ];
    

    return (
        <div className="flex flex-col w-full mt-10">
            {/* Header with better contrast */}
            <div className="mb-1 md:mb-2">
                <h1 className="text-xl md:text-2xl text-gold font-extrabold mb-3 md:mb-4 drop-shadow-lg">
                    Popular on Lucid Path
                </h1>
            </div>

            {/* Slider Container */}
            <div className="flex overflow-x-auto no-scrollbar space-x-4 md:space-x-6">
                {cardData.map((card, index) => (
                    <div key={index} className="flex-shrink-0 w-72 md:w-80 focus:outline-none">
                        {/* Individual Card with glass morphism effect */}
                        <div className="rounded-2xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 transform">
                            
                            {/* Image Area */}
                            <div className="w-full h-40 md:h-48 overflow-hidden rounded-t-2xl">
                                <img 
                                    src={card.img} 
                                    alt={card.title} 
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            
                            {/* Text Content Area */}
                            <div className="flex flex-col py-5 md:py-6 px-5 md:px-6 bg-white/10 border border-[#1a3a3a]">
                                <div className="flex items-center mb-3">
                                    <div className={`w-3 h-3 rounded-full ${card.accentColor.replace('text', 'bg')} mr-3`}></div>
                                        <h3 className="text-xl md:text-2xl text-white">
                                        {card.title}
                                        </h3>
                                    </div>
                            
                                    <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                                        {card.text}
                                    </p>
                            
                                    {/* CTA Button */}
                                    {card.btn}
                                </div>
                            </div>
                        </div>
                ))}
            </div>
        </div>
    );
};

export default PopularContent;