import { useEffect, useState } from "react";
import axios from "axios";

function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/get-tasks/${user.id}`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (taskTitle.trim() === "") {
      alert("Please enter task title");
      return;
    }

    if (editId) {
      await axios.put(`http://localhost:5000/update-task/${editId}`, {
        taskTitle,
        priority,
        status,
      });

      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/add-task", {
        taskTitle,
        priority,
        status,
        userId: user.id,
      });
    }

    setTaskTitle("");
    setPriority("Medium");
    setStatus("Pending");
    fetchTasks();
  };

  const editTask = (task) => {
    setTaskTitle(task.taskTitle);
    setPriority(task.priority);
    setStatus(task.status);
    setEditId(task._id);
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/delete-task/${id}`);
    fetchTasks();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Study Task Planner</h1>

      <div className="bg-white p-6 rounded shadow mb-6 text-black">
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button
          onClick={addOrUpdateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-gray-500">
            No tasks added yet.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center text-black"
            >
              <div>
                <h3 className="font-bold text-lg">{task.taskTitle}</h3>
                <p className="text-sm text-gray-600">
                  Priority: {task.priority}
                </p>
                <p className="text-sm font-semibold text-indigo-600">
                  Status: {task.status}
                </p>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => editTask(task)}
                  className="text-green-600 font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 font-semibold"
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

export default Tasks;