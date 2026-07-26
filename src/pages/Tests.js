import { useState, useEffect } from "react";
import axios from "axios";

function Tests() {
  const [testName, setTestName] = useState("");
  const [score, setScore] = useState("");
  const [tests, setTests] = useState([]);
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTests = async () => {
    const res = await axios.get(`https://placement-preparation-tracker-1-ayd3.onrender.com/get-tests/${user.id}`);
    setTests(res.data);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const addOrUpdateTest = async () => {
    if (testName.trim() === "" || score === "") {
      alert("Please enter test name and score");
      return;
    }

    if (Number(score) < 0 || Number(score) > 100) {
      alert("Score must be between 0 and 100");
      return;
    }

    if (editId) {
      await axios.put(`https://placement-preparation-tracker-1-ayd3.onrender.com/update-test/${editId}`, {
        testName,
        score,
      });

      setEditId(null);
    } else {
      await axios.post("https://placement-preparation-tracker-1-ayd3.onrender.com/add-test", {
        testName,
        score,
        userId: user.id,
      });
    }

    setTestName("");
    setScore("");
    fetchTests();
  };

  const editTest = (test) => {
    setTestName(test.testName);
    setScore(test.score);
    setEditId(test._id);
  };

  const deleteTest = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this mock test?"
    );

    if (!confirmDelete) return;

    await axios.delete(`https://placement-preparation-tracker-1-ayd3.onrender.com/delete-test/${id}`);
    fetchTests();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mock Tests</h1>

      <div className="flex gap-2 mb-6 bg-white p-4 rounded shadow text-black">
        <input
          type="text"
          placeholder="Test Name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="border p-2 rounded w-64 text-black"
        />

        <input
          type="number"
          placeholder="Score (%)"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border p-2 rounded w-32 text-black"
        />

        <button
          onClick={addOrUpdateTest}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="space-y-3">
        {tests.map((t) => (
          <div
            key={t._id}
            className="bg-white p-3 rounded shadow flex justify-between items-center text-black"
          >
            <div>
              <p className="font-medium text-black">{t.testName}</p>
              <p className="text-sm text-gray-600">{t.score}%</p>
            </div>

            <div className="space-x-3">
              <button
                onClick={() => editTest(t)}
                className="text-green-600 font-semibold"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTest(t._id)}
                className="text-red-500 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tests;