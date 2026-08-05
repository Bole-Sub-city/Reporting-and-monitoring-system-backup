import { useState } from "react";
import { submitQonnaReport } from "../../api/reportApi";

const QonnaForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    user_id: userId,
    report_date: new Date().toISOString().split("T")[0],
    report_type: "Qonna Report",
    furdisa: 0,
    annan: 0,
    lukkuu: 0,
    booyyee: 0,
    qurxummii: 0,
    kanniissa: 0,
    yaada_gudinaa: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "furdisa",
      "annan",
      "lukkuu",
      "booyyee",
      "qurxummii",
      "kanniissa",
    ];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await submitQonnaReport(formData);
      setMessage("Qonna report submitted successfully!");
      setFormData({
        ...formData,
        furdisa: 0,
        annan: 0,
        lukkuu: 0,
        booyyee: 0,
        qurxummii: 0,
        kanniissa: 0,
        yaada_gudinaa: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-[#e2e8f0]">
      <h2 className="text-xl font-bold text-[#1e293b] mb-6">
        Qonna Report
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("successfully")
              ? "bg-[#f0faf4] text-[#166534] border border-[#bbf7d0]"
              : "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "furdisa", label: "Furdisa" },
          { name: "annan", label: "Annan" },
          { name: "lukkuu", label: "Lukkuu" },
          { name: "booyyee", label: "Booyyee" },
          { name: "qurxummii", label: "Qurxummii" },
          { name: "kanniissa", label: "Kanniissa" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-[#334155] mb-1">
              {label}
            </label>
            <input
              type="number"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2.5 bg-[#f4f6f9] border border-[#e2e8f0] rounded-lg text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-[#334155] mb-1">
            Yaada Gudinaa
          </label>
          <textarea
            name="yaada_gudinaa"
            value={formData.yaada_gudinaa}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2.5 bg-[#f4f6f9] border border-[#e2e8f0] rounded-lg text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c] resize-none"
            placeholder="Enter Yaada Gudinaa details..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#1a3a5c] hover:bg-[#1e4976] text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Qonna Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QonnaForm;
