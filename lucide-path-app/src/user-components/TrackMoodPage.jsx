import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  LineSquiggle,
  MessageSquare,
  Calendar,
  BookOpenText,
  PenSquare,
  ArrowRight,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import FooterNav from "./FooterNav";
import { AppContent } from "../context/AppContent";
import ChartLazy from "../components/ChartLazy";
import MoodEntry from "./MoodEntry";
import WeeklyMoodTracker from "./WeeklyMoodTracker";
import MoodRecommendations from "./MoodRecommendations";

const TrackMoodPage = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [journalContent, setJournalContent] = useState("");

  // fetch functions so we can re-use after mood logging
  const fetchMoods = useCallback(async () => {
    if (!userData) return;
    try {
      const moodRes = await axios.get(`${backendUrl}/api/moods/${userData._id}`);
      setMoods(moodRes.data.moods || []);
    } catch (err) {
      console.error("Error fetching moods:", err);
    }
  }, [backendUrl, userData]);

  const fetchJournals = useCallback(async () => {
    if (!userData) return;
    try {
      const journalRes = await axios.get(`${backendUrl}/api/journals/${userData._id}`);
      setJournals(journalRes.data.journals || []);
    } catch (err) {
      console.error("Error fetching journals:", err);
    }
  }, [backendUrl, userData]);

  useEffect(() => {
    if (!userData) return;
    setLoading(true);
    Promise.all([fetchMoods(), fetchJournals()])
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [userData, fetchMoods, fetchJournals]);

  

  

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading user info...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading mood and journal data...
      </div>
    );
  }

  const handleLogMood = () => navigate("/mood-selection");
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleJournalSubmit = async () => {
    if (!journalContent.trim()) return;
    try {
      const res = await axios.post(`${backendUrl}/api/journals`, {
        userId: userData._id,
        content: journalContent,
      });
      setJournals([res.data.journal, ...journals]); // update state
      setJournalContent("");
      setShowModal(false);
    } catch (err) {
      console.error("Error saving journal:", err);
    }
  };

  

  // ---- JOURNAL CALENDAR ----
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

  const calendarDays = [...Array(7)].map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const hasMood = moods.some(
      (m) => new Date(m.date).toDateString() === date.toDateString()
    );
    return { date, hasMood };
  });

  // ---- MOOD TRENDS GRAPH ----
  const weeklyDays = [...Array(7)].map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const moodGraphData = weeklyDays.map((day) => {
    const moodEntry = moods
      .filter((m) => new Date(m.date).toDateString() === day.toDateString())
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    const moodValues = {
      Happy: 5,
      Excited: 5,
      Motivated: 4,
      Calm: 4,
      Focused: 3,
      Okay: 3,
      Sad: 2,
      Stressed: 2,
      Anxious: 1,
      Depressed: 1,
      Heartbroken: 1,
      Tired: 1,
      Bored: 1,
      Lonely: 1,
    };
    return moodEntry ? moodValues[moodEntry.name] || 3 : null;
  });

  // per-page mood selection (used by MoodEntry and recommendations)

  // when MoodEntry calls back, refresh moods so the chart and trackers update
  const onMoodSelect = async (mood) => {
    setSelectedMood(mood);
    // re-fetch moods from server to reflect saved state
    await fetchMoods();
  };

  const chartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Mood Level",
        data: moodGraphData,
        fill: false,
        backgroundColor: "rgba(255,215,0,0.6)",
        borderColor: "rgba(255,215,0,0.8)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => ["", "Low", "2", "3", "High", "Max"][value] || value,
        },
      },
    },
  };

  // determine recommended mood (selected by user or computed from average)
  const numericData = moodGraphData.filter((d) => d !== null && d !== undefined);
  const avgNum = numericData.length ? numericData.reduce((a, b) => a + b, 0) / numericData.length : null;

  const avgToMood = (score) => {
    if (!score) return "Okay";
    if (score >= 4.5) return "Excited";
    if (score >= 3.5) return "Happy";
    if (score >= 2.5) return "Okay";
    if (score >= 1.5) return "Sad";
    return "Depressed";
  };

  const moodForRecommendations = selectedMood?.name || avgToMood(avgNum);

  return (
    <div className="flex min-h-screen font-nunito bg-gradient-to-b from-[#0a1f1f] to-[#062b2b] text-white">
      <Sidebar firstName={userData?.firstName || "Guest"} />

      <main className="flex flex-col flex-1 gap-10 px-6 md:px-10 py-8 overflow-y-auto no-scrollbar w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-gold p-2 rounded-full w-max">
            <LineSquiggle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gold">Mood Insights</h2>
          
        </div>

        {/* Quick mood entry + weekly summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2">
            <MoodEntry onMoodSelect={onMoodSelect} />
          </div>

          <div className="lg:col-span-1">
            <WeeklyMoodTracker />
          </div>
        </section>

        {/* Journaling Calendar */}
        <section className="bg-white/10 border border-[#1a3a3a] rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
              <Calendar size={20} /> Journaling Calendar
            </h3>
          </div>

          <p className="text-sm text-gray-300 mb-2">
            You have achieved{" "}
            <span className="text-gold font-bold">
              {Math.round((journals.length / 30) * 100)}%
            </span>{" "}
            of your journaling goal this month.
          </p>
          <p className="text-sm text-gray-400 mb-4">Total entries: {journals.length}</p>

          <div className="grid grid-cols-7 gap-3 text-center text-sm">
            {calendarDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="p-3 rounded-lg border border-[#1f3d3d] w-full"
                  style={{
                    backgroundColor: day.hasMood ? "rgba(255, 215, 0, 0.8)" : "rgba(255,255,255,0.05)",
                  }}
                ></div>
                <span className="text-xs mt-1 text-gray-300">{daysOfWeek[day.date.getDay()]}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleLogMood}
              className="bg-gold hover:bg-yellow-400 transition-all text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto"
            >
              Log My Mood <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Mood Trends Graph */}
        <section className="bg-white/10 border border-[#1a3a3a] rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gold flex items-center gap-2 mb-3">
            Your Mood Trends
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Track how your mood changes weekly.
          </p>
          <ChartLazy data={chartData} options={chartOptions} />
        </section>

        {/* Recommendations - responsive */}
        <section className="bg-white/10 border border-[#1a3a3a] rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <MoodRecommendations mood={moodForRecommendations} />
        </section>

        {/* Journal Entries */}
        <section className="bg-white/10 border border-[#1a3a3a] rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gold flex items-center gap-2 mb-5">
            <BookOpenText size={20} /> Your Journal Entries
          </h3>

          {journals.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">You have no journal entries yet.</p>
          ) : (
            <div className="space-y-4">
              {journals.map((entry) => (
                <div
                  key={entry._id}
                  className="p-4 rounded-xl bg-white/5 border border-[#1f3d3d] hover:bg-gold/10 transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={handleOpenModal}
              className="bg-gold hover:bg-yellow-400 transition-all text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto"
            >
              <PenSquare size={18} /> Write Journal Entry
            </button>
          </div>
        </section>
        <div className="mb-10"></div>
      </main>

      <FooterNav />

      {/* --- Slide-up Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/40">
          <div className="w-full max-w-lg bg-[#0f1a1a] rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gold">Write Your Journal</h3>
              <button onClick={handleCloseModal} aria-label="Close modal" title="Close modal">
                <X className="text-white w-6 h-6" />
              </button>
            </div>
            <textarea
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              placeholder="Write down your thoughts..."
              rows={6}
              className="w-full p-4 rounded-xl border border-white/20 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={handleJournalSubmit}
              className="mt-4 w-full bg-gold hover:bg-yellow-400 text-white py-3 rounded-xl font-semibold"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackMoodPage;
