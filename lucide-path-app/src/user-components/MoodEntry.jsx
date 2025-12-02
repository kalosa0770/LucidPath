import React, { useState, useContext } from "react";
import { Lightbulb, Reply, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";

const MoodEntry = ({ onMoodSelect }) => {
  const [selectMood, setSelectMood] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
    // quick optimistic UI update
    setSelectMood(mood);
    onMoodSelect(mood);
    setIsSaving(true);
    setSaved(false);

    if (!userData || !userData._id) {
      setIsSaving(false);
      toast.warn("Please log in to save your mood.", {
        theme: "colored",
        style: { backgroundColor: "#FFD700", color: "#1a1a1a" },
      });
      return;
    }

    try {
      // disable double taps by awaiting
      await axios.post(`${backendUrl}/api/moods`, {
        userId: userData._id,
        emoji: mood.emoji,
        name: mood.name,
      });

      setSaved(true);
      toast.success(`Mood "${mood.name}" logged successfully!`, {
        theme: "colored",
        style: { backgroundColor: "#1a3a3a", color: "#FFD700" },
      });

      // show success state briefly
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      console.error("Error saving mood:", err);
      toast.error("Oops! Something went wrong while saving your mood.", {
        theme: "colored",
        style: { backgroundColor: "#8B0000", color: "#fff" },
      });
      // keep selection but remove saving state
    } finally {
      setIsSaving(false);
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
        Choose how you feel right now — quick, private, and helpful.
      </p>

      {/* prettier card grid with keyboard a11y */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 w-full">
        {moods.map((mood) => {
          const selected = selectMood?.name === mood.name;
          return (
            <button
              key={mood.name}
              onClick={() => handleSelectMood(mood)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectMood(mood);
                }
              }}
              aria-pressed={selected}
              aria-label={`Select mood: ${mood.name}`}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-transform duration-200 ease-out transform focus:outline-none focus:ring-2 focus:ring-gold/60 select-none border border-transparent ${
                selected
                  ? "bg-gold text-dark-teal scale-105 shadow-[0_10px_30px_rgba(249,214,74,0.14)]"
                  : "bg-white/5 hover:bg-white/10 hover:scale-105"
              }`}
            >
              <div className={`text-3xl md:text-4xl leading-none ${isSaving && selected ? 'animate-pulse' : ''}`}>
                {mood.emoji}
              </div>
              <div className="mt-1 text-xs md:text-sm font-semibold text-white/90">{mood.name}</div>

              {/* success check overlay */}
              {selected && saved && (
                <span className="absolute inline-flex items-center justify-center text-white bg-dark-teal rounded-full w-7 h-7 -mt-24 md:-mt-20 shadow-lg">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectMood && (
        <div className="mt-8 text-center">
          <p className="text-lg md:text-xl font-medium text-white">
            You’re feeling <span className="text-gold font-bold">{selectMood.name}</span> {selectMood.emoji}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleMoreClick}
              className="px-5 py-2 bg-white text-dark-teal font-extrabold rounded-full hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              Share more
              <Reply className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setSelectMood(null); setSaved(false); }}
              className="text-sm text-gray-300 hover:text-white underline"
            >
              Not this one
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodEntry;
