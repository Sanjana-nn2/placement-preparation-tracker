import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [topics, setTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [tests, setTests] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [notes, setNotes] = useState([]);

  const [dailyGoal, setDailyGoal] = useState(
    Number(localStorage.getItem("dailyGoal")) || 10
  );

  const fileInputRef = useRef(null);
  const [customMinutes, setCustomMinutes] = useState(
  Number(localStorage.getItem("customMinutes")) || 25
);

const [timeLeft, setTimeLeft] = useState(
  Number(localStorage.getItem("timeLeft")) ||
    (Number(localStorage.getItem("customMinutes")) || 25) * 60
);

const [isRunning, setIsRunning] = useState(false);

  const quotes = [
    "Small progress every day leads to big results.",
    "Consistency beats intensity.",
    "Your future is created by what you do today.",
    "Practice today, confidence tomorrow.",
    "Every problem solved makes you stronger.",
  ];

  const todayQuote = quotes[new Date().getDate() % quotes.length];

  useEffect(() => {
    fetchDashboardData();
    updateStreak();
  }, []);
useEffect(() => {
  localStorage.setItem("timeLeft", timeLeft);
  localStorage.setItem("customMinutes", customMinutes);
}, [timeLeft, customMinutes]);

useEffect(() => {
  if (!isRunning) return;

  if (timeLeft <= 0) {
    setIsRunning(false);

    alert("⏰ Time completed! Take a short break.");

    setTimeLeft(customMinutes * 60);

    localStorage.setItem("timeLeft", customMinutes * 60);

    return;
  }

  const timer = setTimeout(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [isRunning, timeLeft, customMinutes]);

  const fetchDashboardData = async () => {
    try {
      const topicsRes = await axios.get(
        `http://localhost:5000/get-topics/${user.id}`
      );

      const problemsRes = await axios.get(
        `http://localhost:5000/get-problems/${user.id}`
      );

      const testsRes = await axios.get(
        `http://localhost:5000/get-tests/${user.id}`
      );

      const companiesRes = await axios.get(
        `http://localhost:5000/get-companies/${user.id}`
      );

      const notesRes = await axios.get(
        `http://localhost:5000/get-notes/${user.id}`
      );

      setTopics(topicsRes.data);
      setProblems(problemsRes.data);
      setTests(testsRes.data);
      setCompanies(companiesRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const topicsCount = topics.length;
  const problemsCount = problems.length;
  const testsCount = tests.length;
  const companiesCount = companies.length;
  const notesCount = notes.length;

  const averageScore =
    tests.length > 0
      ? Math.round(
          tests.reduce((sum, test) => sum + Number(test.score || 0), 0) /
            tests.length
        )
      : 0;

  const totalActivity =
    topicsCount +
    problemsCount +
    testsCount +
    companiesCount +
    notesCount;

  const progress = Math.min(
    Math.round((totalActivity / dailyGoal) * 100),
    100
  );

  const readinessScore = Math.min(
  Math.round(
    topicsCount * 2 +
      problemsCount * 1 +
      testsCount * 4 +
      companiesCount * 3 +
      notesCount * 1 +
      averageScore * 0.3
  ),
  100
);

  let readinessStatus = "Needs Practice 🌱";
  let readinessMessage =
    "Start adding more topics, problems, companies, notes, and mock tests to improve your placement readiness.";

  if (readinessScore >= 40) {
    readinessStatus = "Building Strong Foundation 💪";
    readinessMessage =
      "Good progress! Continue solving problems, preparing company-wise, and revising notes.";
  }

  if (readinessScore >= 70) {
    readinessStatus = "Almost Interview Ready 🔥";
    readinessMessage =
      "Great work! Focus on revision, mock tests, notes, and target companies.";
  }

  if (readinessScore >= 90) {
    readinessStatus = "Placement Ready 🏆";
    readinessMessage =
      "Excellent! You are strongly prepared for placements.";
  }

  const chartData = [
    { name: "Topics", value: topicsCount },
    { name: "Problems", value: problemsCount },
    { name: "Tests", value: testsCount },
    { name: "Companies", value: companiesCount },
    { name: "Notes", value: notesCount },
    { name: "Avg Score", value: averageScore },
  ];

  let level = "Beginner";
  let badge = "🌱";

  const achievements = [];

if (topicsCount >= 1) {
  achievements.push("📘 First Topic Added");
}

if (problemsCount >= 10) {
  achievements.push("🔥 10 Problems Solved");
}

if (testsCount >= 5) {
  achievements.push("🧠 Mock Test Master");
}

if (companiesCount >= 3) {
  achievements.push("🏢 Company Tracker Pro");
}

if (notesCount >= 5) {
  achievements.push("📝 Revision Champion");
}

if (readinessScore >= 80) {
  achievements.push("🏆 Placement Warrior");
}

  if (totalActivity >= 5) {
    level = "Consistent Learner";
    badge = "🔥";
  }

  if (totalActivity >= 15) {
    level = "Placement Warrior";
    badge = "🏆";
  }

  if (totalActivity >= 30) {
    level = "Interview Master";
    badge = "💎";
  }

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lastVisit");
    let streak = Number(localStorage.getItem("streak")) || 0;

    if (lastVisit !== today) {
      streak += 1;
      localStorage.setItem("streak", streak);
      localStorage.setItem("lastVisit", today);
    }
  };

  const streak = localStorage.getItem("streak") || 1;
  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

  const saveGoal = () => {
    localStorage.setItem("dailyGoal", dailyGoal);
    alert("Goal updated!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Placement Preparation Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Student: ${user.name}`, 20, 35);
    doc.text(`Email: ${user.email}`, 20, 45);
    doc.text(`Topics Completed: ${topicsCount}`, 20, 60);
    doc.text(`Problems Solved: ${problemsCount}`, 20, 70);
    doc.text(`Tests Taken: ${testsCount}`, 20, 80);
    doc.text(`Companies Tracked: ${companiesCount}`, 20, 90);
    doc.text(`Notes Created: ${notesCount}`, 20, 100);
    doc.text(`Average Test Score: ${averageScore}%`, 20, 110);
    doc.text(`Placement Readiness: ${readinessScore}%`, 20, 120);
    doc.text(`Status: ${readinessStatus}`, 20, 130);

    doc.save("Placement_Report.pdf");
  };

  const backupData = async () => {
    const data = { topics, problems, tests, companies, notes };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "placement_backup.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const restoreData = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const text = await file.text();
      const data = JSON.parse(text);

      for (const topic of data.topics || []) {
        await axios.post("http://localhost:5000/add-topic", {
          name: topic.name,
          userId: user.id,
        });
      }

      for (const problem of data.problems || []) {
        await axios.post("http://localhost:5000/add-problem", {
          title: problem.title,
          difficulty: problem.difficulty,
          userId: user.id,
        });
      }

      for (const test of data.tests || []) {
        await axios.post("http://localhost:5000/add-test", {
          testName: test.testName,
          score: test.score,
          userId: user.id,
        });
      }

      for (const company of data.companies || []) {
        await axios.post("http://localhost:5000/add-company", {
          companyName: company.companyName,
          targetRole: company.targetRole,
          status: company.status,
          userId: user.id,
        });
      }

      for (const note of data.notes || []) {
        await axios.post("http://localhost:5000/add-note", {
          title: note.title,
          category: note.category,
          content: note.content,
          userId: user.id,
        });
      }

      await fetchDashboardData();

      alert("Data restored successfully!");
      event.target.value = "";
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Restore failed");
    }
  };

  const recentTopics = topics.slice(-3).reverse();
  const recentProblems = problems.slice(-3).reverse();
  const recentTests = tests.slice(-3).reverse();
  const recentCompanies = companies.slice(-3).reverse();
  const recentNotes = notes.slice(-3).reverse();
  const easyProblems = problems.filter(
  (problem) => problem.difficulty === "Easy"
).length;

const mediumProblems = problems.filter(
  (problem) => problem.difficulty === "Medium"
).length;

const hardProblems = problems.filter(
  (problem) => problem.difficulty === "Hard"
).length;

const difficultyStats = [
  {
    label: "Easy",
    value: easyProblems,
    color: "bg-green-500",
  },
  {
    label: "Medium",
    value: mediumProblems,
    color: "bg-yellow-500",
  },
  {
    label: "Hard",
    value: hardProblems,
    color: "bg-red-500",
  },
];
  const weeklyStats = [
  {
    label: "Topics",
    value: topicsCount,
    color: "bg-blue-500",
  },
  {
    label: "Problems",
    value: problemsCount,
    color: "bg-green-500",
  },
  {
    label: "Tests",
    value: testsCount,
    color: "bg-purple-500",
  },
  {
    label: "Companies",
    value: companiesCount,
    color: "bg-pink-500",
  },
  {
    label: "Notes",
    value: notesCount,
    color: "bg-orange-500",
  },
];
const allActivities = [
  ...topics,
  ...problems,
  ...tests,
  ...companies,
  ...notes,
];

const heatmapData = Array.from({ length: 35 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (34 - i));

  const dateString = date.toDateString();

  const count = allActivities.filter((item) => {
    if (!item.createdAt) return false;

    const itemDate = new Date(item.createdAt).toDateString();
    return itemDate === dateString;
  }).length;

  return {
    day: i,
    date: dateString,
    value: count,
  };
});


  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm opacity-80">Welcome, {user.name}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>

          <button
            onClick={backupData}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Backup Data
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Restore Data
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={restoreData}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-2xl shadow-xl mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {badge} {level}
            </h2>

            <p className="text-lg">{todayQuote}</p>

            <p className="mt-3 text-sm opacity-90">
              Keep going — your placement preparation is leveling up daily.
            </p>
          </div>

          <div className="text-center">
            <p className="text-5xl">🔥</p>
            <p className="text-2xl font-bold">{streak} Days</p>
            <p className="text-sm">Current Streak</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6 text-black">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              🎯 Placement Readiness Score
            </h2>

            <p className="text-gray-600 mb-3">{readinessMessage}</p>

            <p className="text-xl font-semibold text-indigo-600">
              {readinessStatus}
            </p>
          </div>

          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />

              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#16a34a"
                strokeWidth="12"
                fill="none"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * readinessScore) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{readinessScore}%</p>
              <p className="text-sm text-gray-500">Ready</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow mb-6 text-black">
  <h2 className="text-2xl font-bold mb-4">⏱️ Pomodoro Study Timer</h2>

  <div className="flex flex-wrap justify-between items-center gap-6">
    <div>
      <p className="text-gray-600 mb-2">
        Stay focused with a 25-minute study session.
      </p>

      <p className="text-5xl font-bold text-indigo-600">
        {formatTime(timeLeft)}
      </p>
      <div className="mt-4">
  <input
    type="number"
    min="1"
    value={customMinutes}
   onChange={(e) => {
  const minutes = Number(e.target.value);

  setCustomMinutes(minutes);
  setTimeLeft(minutes * 60);

  localStorage.setItem("customMinutes", minutes);
  localStorage.setItem("timeLeft", minutes * 60);
}}
    className="border p-2 rounded w-28 text-black"
    placeholder="Minutes"
  />
</div>
    </div>

    <div className="flex gap-3">
      <button
        onClick={() => setIsRunning(true)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Start
      </button>

      <button
        onClick={() => setIsRunning(false)}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Pause
      </button>

      <button
        onClick={() => {
          setIsRunning(false);
        setTimeLeft(customMinutes * 60);
localStorage.setItem("timeLeft", customMinutes * 60);
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Reset
      </button>
    </div>
  </div>
</div>
      <div className="bg-white p-5 rounded-2xl shadow mb-6 text-black">
  <h2 className="text-2xl font-bold mb-4">🏅 Achievements</h2>

  {achievements.length === 0 ? (
    <p className="text-gray-500">
      No achievements unlocked yet. Keep preparing!
    </p>
  ) : (
    <div className="flex flex-wrap gap-3">
      {achievements.map((achievement, index) => (
        <span
          key={index}
          className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold shadow"
        >
          {achievement}
        </span>
      ))}
    </div>
  )}
</div>

      <div className="bg-white p-5 rounded-2xl shadow mb-6 text-black">
        <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Link
            to="/topics"
            className="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition"
          >
            <h3 className="text-xl font-bold">Add Topic</h3>
            <p className="text-sm opacity-90">Track a new preparation topic</p>
          </Link>

          <Link
            to="/problems"
            className="bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700 transition"
          >
            <h3 className="text-xl font-bold">Add Problem</h3>
            <p className="text-sm opacity-90">Log coding problems</p>
          </Link>

          <Link
            to="/tests"
            className="bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700 transition"
          >
            <h3 className="text-xl font-bold">Add Test</h3>
            <p className="text-sm opacity-90">Record mock test score</p>
          </Link>

          <Link
            to="/companies"
            className="bg-pink-600 text-white p-4 rounded-xl shadow hover:bg-pink-700 transition"
          >
            <h3 className="text-xl font-bold">Add Company</h3>
            <p className="text-sm opacity-90">Track target companies</p>
          </Link>

          <Link
            to="/notes"
            className="bg-orange-600 text-white p-4 rounded-xl shadow hover:bg-orange-700 transition"
          >
            <h3 className="text-xl font-bold">Add Note</h3>
            <p className="text-sm opacity-90">Write revision notes</p>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6 text-black">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              🎯 Daily Goal Tracker
            </h2>

            <p className="text-gray-600 mb-3">
              Set your daily productivity target.
            </p>

            <div className="flex gap-2">
              <input
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="border p-2 rounded w-32 text-black"
              />

              <button
                onClick={saveGoal}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Save Goal
              </button>
            </div>
          </div>

          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />

              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#4f46e5"
                strokeWidth="12"
                fill="none"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * progress) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{progress}%</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="text-gray-600">Topics</h3>
          <p className="text-3xl font-bold">{topicsCount}</p>
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="text-gray-600">Problems</h3>
          <p className="text-3xl font-bold">{problemsCount}</p>
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="text-gray-600">Avg Score</h3>
          <p className="text-3xl font-bold">{averageScore}%</p>
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="text-gray-600">Companies</h3>
          <p className="text-3xl font-bold">{companiesCount}</p>
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="text-gray-600">Notes</h3>
          <p className="text-3xl font-bold">{notesCount}</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow mb-6 text-black">
  <h2 className="text-2xl font-bold mb-4">📅 Weekly Productivity Stats</h2>

  <div className="space-y-4">
    {weeklyStats.map((item, index) => (
      <div key={index}>
        <div className="flex justify-between mb-1">
          <span className="font-semibold">{item.label}</span>
          <span>{item.value}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${item.color} h-3 rounded-full`}
            style={{
              width: `${Math.min(item.value * 10, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    ))}
  </div>
</div>
<div className="bg-white p-5 rounded-2xl shadow mb-6 text-black">
  <h2 className="text-2xl font-bold mb-4">
    📅 Study Activity Heatmap
  </h2>

  <p className="text-gray-600 mb-4">
    Your preparation consistency over recent days.
  </p>

  <div className="grid grid-cols-7 gap-2">
    {heatmapData.map((item, index) => (
      <div
        key={index}
        className={`h-10 rounded ${
          item.value === 0
            ? "bg-gray-200"
            : item.value === 1
            ? "bg-green-200"
            : item.value === 2
            ? "bg-green-400"
            : item.value === 3
            ? "bg-green-500"
            : "bg-green-700"
        }`}
      ></div>
    ))}
  </div>

  <div className="flex gap-3 mt-4 text-sm text-gray-600 flex-wrap">
    <span>⬜ Low</span>
    <span>🟩 Medium</span>
    <span>🟢 High</span>
  </div>
</div>
<div className="bg-white p-5 rounded-2xl shadow mb-6 text-black">
  <h2 className="text-2xl font-bold mb-4">📊 Difficulty-wise Problems</h2>

  <div className="space-y-4">
    {difficultyStats.map((item, index) => (
      <div key={index}>
        <div className="flex justify-between mb-1">
          <span className="font-semibold">{item.label}</span>
          <span>{item.value}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${item.color} h-3 rounded-full`}
            style={{
              width: `${Math.min(item.value * 10, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    ))}
  </div>
</div>

      <div className="bg-white p-5 rounded shadow mb-6 text-black">
        <h3 className="mb-4 font-semibold">Performance Overview</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="font-bold mb-3">Recent Topics</h3>
          {recentTopics.length === 0 ? (
            <p className="text-gray-500">No topics yet</p>
          ) : (
            recentTopics.map((topic) => (
              <p key={topic._id} className="border-b py-2">
                {topic.name}
              </p>
            ))
          )}
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="font-bold mb-3">Recent Problems</h3>
          {recentProblems.length === 0 ? (
            <p className="text-gray-500">No problems yet</p>
          ) : (
            recentProblems.map((problem) => (
              <p key={problem._id} className="border-b py-2">
                {problem.title} - {problem.difficulty}
              </p>
            ))
          )}
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="font-bold mb-3">Recent Tests</h3>
          {recentTests.length === 0 ? (
            <p className="text-gray-500">No tests yet</p>
          ) : (
            recentTests.map((test) => (
              <p key={test._id} className="border-b py-2">
                {test.testName} - {test.score}%
              </p>
            ))
          )}
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="font-bold mb-3">Recent Companies</h3>
          {recentCompanies.length === 0 ? (
            <p className="text-gray-500">No companies yet</p>
          ) : (
            recentCompanies.map((company) => (
              <p key={company._id} className="border-b py-2">
                {company.companyName} - {company.status}
              </p>
            ))
          )}
        </div>

        <div className="bg-white p-5 rounded shadow text-black">
          <h3 className="font-bold mb-3">Recent Notes</h3>
          {recentNotes.length === 0 ? (
            <p className="text-gray-500">No notes yet</p>
          ) : (
            recentNotes.map((note) => (
              <p key={note._id} className="border-b py-2">
                {note.title} - {note.category}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;