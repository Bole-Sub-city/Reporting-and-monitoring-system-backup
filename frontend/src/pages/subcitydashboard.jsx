import { useState, useEffect } from "react";
import CarraaHojiiForm from "../components/reports/CarraaHojiiForm";
import QonnaForm from "../components/reports/QonnaForm";
// Import other forms when available
// import BuusaaForm from '../components/reports/BuusaaForm';

export default function SubCityDashboard() {
  const [activeForm, setActiveForm] = useState("carraa-hojii");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Get user ID from localStorage or context
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id || "");
    }
  }, []);

  const formTabs = [
    { id: "carraa-hojii", label: "Carraa Hojii Uummuu" },
    { id: "qonna", label: "Qonna" },
    { id: "buusaa", label: "Buusaa Gonofaa" },
    // Add other form tabs as needed
  ];

  const renderForm = () => {
    switch (activeForm) {
      case "carraa-hojii":
        return <CarraaHojiiForm userId={userId} />;
      case "qonna":
        return <QonnaForm userId={userId} />;
      // case 'buusaa':
      //   return <BuusaaForm userId={userId} />;
      default:
        return (
          <div className="text-center py-8">
            Select a form to begin reporting
          </div>
        );
    }
  };

  return (
    <div className="min-h-svh bg-navy-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-gold-gradient">
            Sub-city Reporting Dashboard
          </h1>
          <p className="mt-3 text-slate-300">
            Submit your daily reports and track progress here
          </p>
        </div>

        {/* Form Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-navy-700">
            <nav className="-mb-px flex space-x-1">
              {formTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveForm(tab.id)}
                  className={`
                    py-3 px-4 font-medium text-sm rounded-t-lg border-b-2 transition-colors
                    ${
                      activeForm === tab.id
                        ? "border-gold-500 text-gold-400 bg-navy-800"
                        : "border-transparent text-slate-400 hover:text-slate-300 hover:border-navy-600"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Active Form Content */}
        <div className="bg-navy-900 rounded-lg p-6">{renderForm()}</div>

        {/* Report History Section */}
        <div className="mt-8 bg-navy-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gold-400 mb-4">
            Recent Reports
          </h2>
          <div className="text-center py-8 text-slate-400">
            <p>Report history will appear here once you submit reports</p>
            <p className="text-sm mt-2">
              You can view, edit, or delete previous reports
            </p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-navy-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-1">
              Reports Submitted
            </h3>
            <p className="text-2xl font-bold text-gold-400">0</p>
          </div>
          <div className="bg-navy-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-1">
              Last Submission
            </h3>
            <p className="text-lg text-slate-300">No submissions yet</p>
          </div>
          <div className="bg-navy-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-400 mb-1">
              Next Report Due
            </h3>
            <p className="text-lg text-slate-300">Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
