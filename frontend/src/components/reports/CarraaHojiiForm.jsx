import { useState } from "react";
import { submitCarraaHojiiReport } from "../../api/reportApi";

const CarraaHojiiForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    user_id: userId,
    report_date: new Date().toISOString().split("T")[0],
    report_type: "Carraa Hojii Uummuu",
    qusannnaa: 0,
    liqii: 0,
    qusanna_dirqii: 0,
    deebii_liqii_bilchaate: 0,
    deebii_liqii_bulee: 0,
    carraa_hojii_dhaabbii: 0,
    carraa_hojii_qacarrii: 0,
    leenjii: 0,
    industrii_godoo: 0,
    yaada_gudinaa: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "qusannnaa",
      "liqii",
      "qusanna_dirqii",
      "deebii_liqii_bilchaate",
      "deebii_liqii_bulee",
      "carraa_hojii_dhaabbii",
      "carraa_hojii_qacarrii",
      "leenjii",
      "industrii_godoo",
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
      await submitCarraaHojiiReport(formData);
      setMessage("Carraa Hojii Uummuu report submitted successfully!");
      setFormData({
        ...formData,
        qusannnaa: 0,
        liqii: 0,
        qusanna_dirqii: 0,
        deebii_liqii_bilchaate: 0,
        deebii_liqii_bulee: 0,
        carraa_hojii_dhaabbii: 0,
        carraa_hojii_qacarrii: 0,
        leenjii: 0,
        industrii_godoo: 0,
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
        Carraa Hojii Uummuu Report
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
            Qusannnaa
          </label>
          <input
            type="number"
            name="qusannnaa"
            value={formData.qusannnaa}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Liqii
          </label>
          <input
            type="number"
            name="liqii"
            value={formData.liqii}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qusanna Dirqii
          </label>
          <input
            type="number"
            name="qusanna_dirqii"
            value={formData.qusanna_dirqii}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Deebii Liqii Bilchaate
          </label>
          <input
            type="number"
            name="deebii_liqii_bilchaate"
            value={formData.deebii_liqii_bilchaate}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Deebii Liqii Bulee
          </label>
          <input
            type="number"
            name="deebii_liqii_bulee"
            value={formData.deebii_liqii_bulee}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Carraa Hojii Dhaabbii
          </label>
          <input
            type="number"
            name="carraa_hojii_dhaabbii"
            value={formData.carraa_hojii_dhaabbii}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Carraa Hojii Qacarrii
          </label>
          <input
            type="number"
            name="carraa_hojii_qacarrii"
            value={formData.carraa_hojii_qacarrii}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Leenjii
          </label>
          <input
            type="number"
            name="leenjii"
            value={formData.leenjii}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Industrii Godoo
          </label>
          <input
            type="number"
            name="industrii_godoo"
            value={formData.industrii_godoo}
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
            {loading ? "Submitting..." : "Submit Carraa Hojii Uummuu Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarraaHojiiForm;
