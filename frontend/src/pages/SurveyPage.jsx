import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuthService } from "../services/mockAuthService";
import { toast } from "react-hot-toast";

const SurveyPage = () => {
  const user = useMemo(() => mockAuthService.getCurrentUser(), []);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    useCases: [],
    budget: "",
    categories: [],
    notes: "",
    contactEmail: user?.email || "",
  });

  const [step, setStep] = useState(0);

  const useCaseOptions = [
    "Model training",
    "Market research",
    "Academic study",
    "Product development",
    "Other",
  ];

  const categoryOptions = [
    "E-commerce",
    "Healthcare",
    "Social Media",
    "Finance",
    "Geospatial",
  ];

  const budgetOptions = [
    { id: "lt100", label: "Under $100" },
    { id: "100-500", label: "$100 - $500" },
    { id: "500-2000", label: "$500 - $2,000" },
    { id: "gt2000", label: "Above $2,000" },
  ];

  const toggleArrayValue = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      const nextArr = exists
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: nextArr };
    });
  };

  const canProceed = () => {
    if (step === 0) return form.contactEmail.trim().length > 0;
    if (step === 1) return form.useCases.length > 0;
    if (step === 2) return !!form.budget;
    if (step === 3) return form.categories.length > 0;
    if (step === 4) return true; // notes optional
    return true;
  };

  const onNext = (e) => {
    e.preventDefault();
    if (!canProceed()) {
      toast.error("Please complete this step before continuing.");
      return;
    }
    if (step < 4) {
      setStep((s) => s + 1);
    } else {
      // final submit
      try {
        const payload = {
          ...form,
          userId: user?.id || null,
          submittedAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem("surveys") || "[]");
        localStorage.setItem("surveys", JSON.stringify([...existing, payload]));
        toast.success("Thanks! Your preferences have been saved.");
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save survey. Please try again.");
      }
    }
  };

  const onBack = (e) => {
    e.preventDefault();
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="">
      {/* Card */}
      <div className="relative z-10 flex flex-col w-full max-w-3xl mx-auto mt-8 mb-12 rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 md:px-10 md:py-8 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Data Needs Survey
          </h1>
          <p className="text-gray-600 mt-1">Step {step + 1} of 5</p>
        </div>

        {/* Single-step Form */}
        <form className="px-6 py-6 md:px-10 md:py-8 space-y-8">
          {step === 0 && (
            <section className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                }
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </section>
          )}

          {step === 1 && (
            <section className="space-y-3">
              <div className="text-sm font-semibold text-gray-700">
                Primary Use Cases
              </div>
              <div className="flex flex-wrap gap-3">
                {useCaseOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleArrayValue("useCases", opt)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      form.useCases.includes(opt)
                        ? "bg-indigo-600 border-indigo-600 text-white shadow"
                        : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-3">
              <div className="text-sm font-semibold text-gray-700">
                Estimated Budget
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                {budgetOptions.map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer transition-all ${
                      form.budget === b.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="budget"
                      checked={form.budget === b.id}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, budget: b.id }))
                      }
                      className="text-indigo-600"
                    />
                    <span className="text-gray-800">{b.label}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-3">
              <div className="text-sm font-semibold text-gray-700">
                Interested Categories
              </div>
              <div className="flex flex-wrap gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayValue("categories", cat)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      form.categories.includes(cat)
                        ? "bg-violet-600 text-white shadow"
                        : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Additional Requirements
              </label>
              <textarea
                rows={5}
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Describe formats, freshness, regions, or any constraints..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition-all"
              />
            </section>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={step === 0}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 shadow transition-all"
            >
              {step < 4 ? "Next" : "Submit Survey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyPage;
