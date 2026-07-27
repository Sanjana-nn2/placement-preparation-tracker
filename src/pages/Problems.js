import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Problems() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [problems, setProblems] = useState([]);
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const res = await axios.get(`http://localhost:5000/get-problems/${user.id}`);
    setProblems(res.data);
  };

  const addOrUpdateProblem = async () => {
    if (!title.trim()) {
      toast.error("Please enter a problem title");
      return;
    }

    if (editId) {
      await axios.put(`http://localhost:5000/update-problem/${editId}`, {
        title,
        difficulty,
      });

      toast.success("Problem updated successfully!");
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/add-problem", {
        title,
        difficulty,
        userId: user.id,
      });

      toast.success("Problem added successfully!");
    }

    setTitle("");
    setDifficulty("Easy");
    fetchProblems();
  };

  const editProblem = (problem) => {
    setTitle(problem.title);
    setDifficulty(problem.difficulty);
    setEditId(problem._id);
  };

  const deleteProblem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?"
    );

    if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/delete-problem/${id}`);
    fetchProblems();
    toast.success("Problem deleted successfully!");
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      filterDifficulty === "All" || problem.difficulty === filterDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Problems</h1>

      <div className="bg-white p-6 rounded shadow mb-6 text-black">
        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button
          onClick={addOrUpdateProblem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Problem" : "Add Problem"}
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6 flex flex-wrap gap-4 text-black">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[220px] text-black"
        />

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="border p-2 rounded text-black"
        >
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-gray-500">
            No problems found.
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div
              key={problem._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center text-black"
            >
              <div>
                <h3 className="font-semibold text-black">{problem.title}</h3>
                <p className="text-sm text-gray-600">
                  Difficulty: {problem.difficulty}
                </p>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => editProblem(problem)}
                  className="text-green-600 font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProblem(problem._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Problems;