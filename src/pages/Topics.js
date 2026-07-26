import { useState, useEffect } from "react";
import axios from "axios";

function Topics() {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTopics = async () => {
    const res = await axios.get(`https://placement-preparation-tracker-1-ayd3.onrender.com/get-topics/${user.id}`);
    setTopics(res.data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const addOrUpdateTopic = async () => {
    if (topic.trim() === "") return;

    if (editId) {
      await axios.put(`https://placement-preparation-tracker-1-ayd3.onrender.com/update-topic/${editId}`, {
        name: topic,
      });
      setEditId(null);
    } else {
      await axios.post("https://placement-preparation-tracker-1-ayd3.onrender.com/add-topic", {
        name: topic,
        userId: user.id,
      });
    }

    setTopic("");
    fetchTopics();
  };

  const deleteTopic = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this topic?"
    );

    if (!confirmDelete) return;

    await axios.delete(`https://placement-preparation-tracker-1-ayd3.onrender.com/delete-topic/${id}`);
    fetchTopics();
  };

  const editTopic = (item) => {
    setTopic(item.name);
    setEditId(item._id);
  };

  const filteredTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Topics</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border p-2 rounded w-64 text-black"
        />

        <button
          onClick={addOrUpdateTopic}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-64 mb-6 text-black"
      />

      <div className="space-y-3">
        {filteredTopics.map((t) => (
          <div
            key={t._id}
            className="bg-white p-3 rounded shadow flex justify-between items-center text-black"
          >
            <span className="text-black">{t.name}</span>

            <div className="space-x-3">
              <button
                onClick={() => editTopic(t)}
                className="text-green-600 font-semibold"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTopic(t._id)}
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

export default Topics;