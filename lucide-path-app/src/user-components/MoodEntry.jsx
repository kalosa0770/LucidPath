import React, { useState, useContext } from "react";
import { Lightbulb, Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";

const MoodEntry = ({ onMoodSelect }) => {
  const [selectMood, setSelectMood] = useState(null);
  const { userData, backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const moods = [
    { name: "Happy", emoji: "😀" },
    { name: "Sad", emoji: "😥" },
    { name: "Stressed", emoji: "😖" },
    { name: "Depressed", emoji: "😭" },
    { name: "Anxious", emoji: "😬" },
    { name: "Heartbroken", emoji: "💔" },
    { name: "Tired", emoji: "😴" },
    { name: "Motivated", emoji: "🏃‍♂️" },
    { name: "Calm", emoji: "😎" },
    { name: "Focused", emoji: "🎯" },
    { name: "Confused", emoji: "😕" },
    { name: "Excited", emoji: "🤩" },
    { name: "Grateful", emoji: "🙏" },
    { name: "Bored", emoji: "🥱" },
    { name: "Lonely", emoji: "😔" },
  ];

  const handleSelectMood = async (mood) => {
    setSelectMood(mood);
    onMoodSelect(mood);

    try {
      if (!userData || !userData._id) {
        toast.warn("Please log in to save your mood.", {
          theme: "colored",
          style: { backgroundColor: "#FFD700", color: "#1a1a1a" },
        });
        return;
      }

      await axios.post(`${backendUrl}/api/moods`, {
        userId: userData._id,
        emoji: mood.emoji,
        name: mood.name,
      });

      toast.success(`Mood "${mood.name}" logged successfully!`, {
        theme: "colored",
        style: { backgroundColor: "#1a3a3a", color: "#FFD700" },
      });
    } catch (err) {
      console.error("Error saving mood:", err);
      toast.error("Oops! Something went wrong while saving your mood.", {
        theme: "colored",
        style: { backgroundColor: "#8B0000", color: "#fff" },
      });
    }
  };

  const handleMoreClick = () => {
    if (!selectMood) return;
    navigate(`/mood-questions/${selectMood.name}`, {
      state: { mood: selectMood },
    });
  };

  return (
    <div className="flex flex-col  w-full">
      <h2 className="text-lg md:text-xl font-extrabold mb-3 text-gold flex items-center gap-2">
        <span className="bg-gold/20 p-2 rounded-full">
          <Lightbulb className="w-5 h-5 text-dark-gold" />
        </span>
        Track Your Mood
      </h2>

      <p className="text-white mb-5 text-start text-base md:text-lg font-extrabold">
        Tap an emoji that best describes today
      </p>

      <div className="flex overflow overflow-x-auto gap-4 justify-items-center w-full">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleSelectMood(mood)}
            className={`flex flex-col text-2xl md:text-3xl bg-white/30 rounded-2xl p-3 transition-all duration-200 shadow-md 
              ${
                selectMood?.name === mood.name 
                  ? "bg-gold text-teal-950 scale-110 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  : "hover:bg-teal-800/40 hover:scale-105"
              }`}
            title={mood.name}
          >
            {mood.emoji}
            <p className="text-sm text-white">{mood.name}</p>
          </button>
        ))}
      </div>

      {selectMood && (
        <div className="mt-8 text-center">
          <p className="text-lg md:text-xl font-medium text-white">
            You’re feeling{" "}
            <span className="text-gold font-bold">{selectMood.name}</span>{" "}
            today {selectMood.emoji}
          </p>

          <button
            onClick={handleMoreClick}
            className="mt-5 px-6 py-2 bg-white text-teal font-extrabold rounded-full hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
          >
            Share more about this mood
            <Reply className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodEntry;
