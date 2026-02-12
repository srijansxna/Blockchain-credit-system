import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    aadhaar: "",
    pan: "",
    salary: "",
    itr1: "",
    itr2: "",
    itr3: "",
    loanAmount: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

   const payload = {
  fullName: formData.name,
  aadhaarNumber: formData.aadhaar,
  panNumber: formData.pan,
  avgSalary: Number(formData.salary),
  itrYear1: Number(formData.itr1),
  itrYear2: Number(formData.itr2),
  itrYear3: Number(formData.itr3),
  loanAmount: Number(formData.loanAmount)
};


    try {
      const response = await fetch("https://blockchain-credit-system.onrender.com/credit/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Application failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Blockchain Credit Application</h2>

      <form onSubmit={handleSubmit} className="form">
        <h3>Applicant Details</h3>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} required />
        <input name="pan" placeholder="PAN Number" onChange={handleChange} required />

        <h3>Financial Details</h3>
        <input name="salary" type="number" placeholder="3-Month Avg Salary" onChange={handleChange} required />
        <input name="itr1" type="number" placeholder="ITR Year 1" onChange={handleChange} required />
        <input name="itr2" type="number" placeholder="ITR Year 2" onChange={handleChange} required />
        <input name="itr3" type="number" placeholder="ITR Year 3" onChange={handleChange} required />

        <h3>Loan Request</h3>
        <input name="loanAmount" type="number" placeholder="Loan Amount Requested" onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Apply"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* APPROVED FLOW */}
      {result && result.status === "ELIGIBLE" && (
        <div className="approved">
          <h3>✅ LOAN APPROVED</h3>
          <p><strong>Loan ID:</strong> {result.loanId}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p className="blockchain">
            ✔ This application has been <strong>written to the Blockchain</strong>
          </p>
        </div>
      )}

      {/* REJECTED FLOW */}
      {result && result.status !== "ELIGIBLE" && (
        <div className="rejected">
          <h3>❌ REJECTED</h3>
          <p>Your loan application did not meet the eligibility threshold.</p>
        </div>
      )}
    </div>
  );
}

export default App;
