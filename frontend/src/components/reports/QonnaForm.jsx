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
    <div className="max-w-4xl mx-auto p-6 bg-navy-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gold-gradient mb-6">
        Qonna Report
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Furdisa
          </label>
          <input
            type="number"
            name="furdisa"
            value={formData.furdisa}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Annan
          </label>
          <input
            type="number"
            name="annan"
            value={formData.annan}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Lukkuu
          </label>
          <input
            type="number"
            name="lukkuu"
            value={formData.lukkuu}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Booyyee
          </label>
          <input
            type="number"
            name="booyyee"
            value={formData.booyyee}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qurxummii
          </label>
          <input
            type="number"
            name="qurxummii"
            value={formData.qurxummii}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Kanniissa
          </label>
          <input
            type="number"
            name="kanniissa"
            value={formData.kanniissa}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Yaada Gudinaa
          </label>
          <textarea
            name="yaada_gudinaa"
            value={formData.yaada_gudinaa}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
            placeholder="Enter Yaada Gudinaa details..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gold-600 hover:bg-gold-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Qonna Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QonnaForm;
