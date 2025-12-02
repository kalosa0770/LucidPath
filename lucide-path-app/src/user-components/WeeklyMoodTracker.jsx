import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import ChartLazy from "../components/ChartLazy";
import { ArrowRight } from "lucide-react";

const WeeklyMoodTracker = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to get start of current week (Sunday)
  const getStartOfWeek = (date) => {
    const day = date.getDay(); // 0 = Sunday
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };

  const today = new Date();
  const startOfWeek = getStartOfWeek(new Date());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday

  // Fetch moods when userData is available
  useEffect(() => {
    const fetchMoods = async () => {
      if (!userData) return;
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/moods/${userData._id}`, {
          withCredentials: true,
        });
        setMoods(res.data.moods || []);
      } catch (err) {
        console.error("Failed to fetch moods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, [userData, backendUrl]);

  

  

  if (loading) return <p className="text-white">Loading moods...</p>;
  if (!userData) return <p className="text-white">Please log in to view moods.</p>;

  // Group moods by day (0=Sun ... 6=Sat) for current week
  const moodsByDay = weekdays.map((_, index) => {
    const dayMoods = moods
      .filter((m) => {
        const moodDate = new Date(m.date);
        return (
          moodDate >= startOfWeek &&
          moodDate <= endOfWeek &&
          moodDate.getDay() === index
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
    return dayMoods;
  });

  // recent mood removed — not shown in the simplified layout

  // ---- compute weekly mood score for trend (values 1-5)
  const moodScoreMap = {
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

  // previous week range
  const prevStart = new Date(startOfWeek);
  prevStart.setDate(prevStart.getDate() - 7);
  const prevEnd = new Date(prevStart);
  prevEnd.setDate(prevEnd.getDate() + 6);

  const weeklyScores = moods
    .filter((m) => {
      const d = new Date(m.date);
      return d >= startOfWeek && d <= endOfWeek;
    })
    .map((m) => moodScoreMap[m.name] || 3);

  const prevWeeklyScores = moods
    .filter((m) => {
      const d = new Date(m.date);
      return d >= prevStart && d <= prevEnd;
    })
    .map((m) => moodScoreMap[m.name] || 3);

  const avg = weeklyScores.length ? (weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length).toFixed(1) : null;
  const prevAvg = prevWeeklyScores.length ? (prevWeeklyScores.reduce((a, b) => a + b, 0) / prevWeeklyScores.length).toFixed(1) : null;

  // build sparkline data for the week (for chart)
  const sparkData = weekdays.map((_, index) => {
    const dayMoods = moodsByDay[index] || [];
    if (!dayMoods.length) return null;
    const scores = dayMoods.map((m) => moodScoreMap[m.name] || 3);
    const dayAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Number(dayAvg.toFixed(2));
  });

  // compute average numeric value for the week (if present)
  const avgNum = avg ? parseFloat(avg) : null;

  // helper: convert average score (1-5) to an emoji for an overview badge
  const scoreToEmoji = (score) => {
    if (score === null || score === undefined) return "🙂"; // neutral fallback
    if (score >= 4.5) return "🤩"; // excellent
    if (score >= 3.5) return "😄"; // very good
    if (score >= 2.5) return "🙂"; // okay / average
    if (score >= 1.5) return "😕"; // low
    return "😔"; // very low
  };

  

  return (
    <div className="w-full bg-white/10 rounded-2xl backdrop-blur-md shadow-lg font-nunito text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-left text-amber-400">Weekly Mood Overview</h2>
        <div className="flex items-center gap-4 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold/90" />
            <span>Average mood:</span>
            <strong className="text-white ml-1">{avg ? `${avg} / 5` : "—"}</strong>
          </div>
          <div className="text-amber-300">
            {prevAvg ? (avg > prevAvg ? "▲ Up" : avg < prevAvg ? "▼ Down" : "—") : "—"}
          </div>
        </div>
      </div>

      {/* Day details modal removed (grid overview enabled earlier) */}

      {/* Nested entry viewer removed */}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Grid overview removed - simplified weekly tracker UI */}

        {/* Right column - sparkline + quick stats */}
        <div className="w-full flex flex-col gap-4">
          <div className="bg-white/5 rounded-xl p-3 border border-[#1f3d3d] min-h-[100px]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center text-dark-teal font-bold text-xl" aria-hidden="true">{scoreToEmoji(avgNum)}</div>
                <div>
                  <div className="text-sm text-gray-300">This week</div>
                  <div className="text-lg font-extrabold text-white">{avg ? `${avg} average` : "No data"}</div>
                </div>
              </div>
              <div className="text-xs text-gray-300">Entries: <span className="text-white font-semibold">{weeklyScores.length}</span></div>
            </div>
            <div className="w-full">
              <ChartLazy data={{
                labels: weekdays,
                datasets: [{ data: sparkData.map((d) => d ?? 0), borderColor: 'rgba(249,214,74,0.95)', backgroundColor: 'rgba(249,214,74,0.12)', fill: true, tension:0.3 }]
              }} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { display: false }, x: { display: false } }
              }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 border border-[#1f3d3d]">
              <div className="text-xs text-gray-400">Best day</div>
              <div className="text-xl text-white font-bold mt-1">{
                moodsByDay.reduce((best, dayArr, idx) => {
                  if (!dayArr.length) return best;
                  const scores = dayArr.map((m) => moodScoreMap[m.name] || 3);
                  const avgScore = scores.reduce((a,b)=>a+b,0)/scores.length;
                  return !best || avgScore > best.avg ? { day: weekdays[idx], avg: avgScore } : best;
                }, null)?.day || "—"
              }</div>
              <div className="text-xs text-gray-300 mt-1">Days tracked: <strong className="text-white">{moodsByDay.filter(d=>d.length).length}</strong></div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-[#1f3d3d]">
              <div className="text-xs text-gray-400">Consistency</div>
              <div className="text-xl text-white font-bold mt-1">{moodsByDay.filter(d=>d.length).length} / 7</div>
              <div className="text-xs text-gray-300 mt-2">Keep logging for streaks & better recommendations</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button onClick={()=> window.location.href = '/mood-selection'} className="flex items-center gap-2 bg-gold hover:bg-dark-gold text-dark-teal px-4 py-2 rounded-lg font-semibold shadow">Log Mood <ArrowRight size={16} /></button>
            <button onClick={()=> window.location.href = '/track'} className="text-xs text-gray-300 underline hover:text-white">See full mood insights</button>
          </div>
        </div>
      </div>

      {/* recent mood display removed as requested */}
    </div>
  );
};

export default WeeklyMoodTracker;

