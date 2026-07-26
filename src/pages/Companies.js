import { useEffect, useState } from "react";
import axios from "axios";

function Companies() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [companyName, setCompanyName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [companies, setCompanies] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchCompanies = async () => {
    const res = await axios.get(
      `https://placement-preparation-tracker-1-ayd3.onrender.com/get-companies/${user.id}`
    );
    setCompanies(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addOrUpdateCompany = async () => {
    if (companyName.trim() === "" || targetRole.trim() === "") {
      alert("Please enter company name and target role");
      return;
    }

    if (editId) {
      await axios.put(`https://placement-preparation-tracker-1-ayd3.onrender.com/update-company/${editId}`, {
        companyName,
        targetRole,
        status,
      });

      setEditId(null);
    } else {
      await axios.post("https://placement-preparation-tracker-1-ayd3.onrender.com/add-company", {
        companyName,
        targetRole,
        status,
        userId: user.id,
      });
    }

    setCompanyName("");
    setTargetRole("");
    setStatus("In Progress");
    fetchCompanies();
  };

  const editCompany = (company) => {
    setCompanyName(company.companyName);
    setTargetRole(company.targetRole);
    setStatus(company.status);
    setEditId(company._id);
  };

  const deleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    await axios.delete(`https://placement-preparation-tracker-1-ayd3.onrender.com/delete-company/${id}`);
    fetchCompanies();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Company Tracker</h1>

      <div className="bg-white p-6 rounded shadow mb-6 text-black">
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />

        <input
          type="text"
          placeholder="Target Role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Ready</option>
          <option>Applied</option>
        </select>

        <button
          onClick={addOrUpdateCompany}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="space-y-3">
        {companies.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-gray-500">
            No companies added yet.
          </div>
        ) : (
          companies.map((company) => (
            <div
              key={company._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center text-black"
            >
              <div>
                <h3 className="font-bold text-lg">{company.companyName}</h3>
                <p className="text-sm text-gray-600">
                  Role: {company.targetRole}
                </p>
                <p className="text-sm font-semibold text-indigo-600">
                  Status: {company.status}
                </p>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => editCompany(company)}
                  className="text-green-600 font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCompany(company._id)}
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

export default Companies;