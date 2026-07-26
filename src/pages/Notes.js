import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DSA");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    const res = await axios.get(`https://placement-preparation-tracker-1-ayd3.onrender.com/get-notes/${user.id}`);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addOrUpdateNote = async () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("Please enter title and content");
      return;
    }

    if (editId) {
      await axios.put(`https://placement-preparation-tracker-1-ayd3.onrender.com/update-note/${editId}`, {
        title,
        category,
        content,
      });

      setEditId(null);
    } else {
      await axios.post("https://placement-preparation-tracker-1-ayd3.onrender.com/add-note", {
        title,
        category,
        content,
        userId: user.id,
      });
    }

    setTitle("");
    setCategory("DSA");
    setContent("");
    fetchNotes();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setCategory(note.category);
    setContent(note.content);
    setEditId(note._id);
  };

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    await axios.delete(`https://placement-preparation-tracker-1-ayd3.onrender.com/delete-note/${id}`);
    fetchNotes();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notes & Revision</h1>

      <div className="bg-white p-6 rounded shadow mb-6 text-black">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-3 text-black"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full mb-3 text-black"
        >
          <option>DSA</option>
          <option>Aptitude</option>
          <option>DBMS</option>
          <option>OS</option>
          <option>CN</option>
          <option>HR Interview</option>
          <option>Company Specific</option>
        </select>

        <textarea
          placeholder="Write your revision note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full h-32 mb-3 text-black"
        ></textarea>

        <button
          onClick={addOrUpdateNote}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-gray-500">
            No notes added yet.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-5 rounded shadow text-black"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{note.title}</h3>
                  <p className="text-sm text-indigo-600 font-semibold">
                    {note.category}
                  </p>
                </div>

                <div className="space-x-3">
                  <button
                    onClick={() => editNote(note)}
                    className="text-green-600 font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-red-500 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;