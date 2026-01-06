"use client";

export default function PricingPage() {
  async function handleSubscribe() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    if (!res.ok) {
      alert("Failed to start checkout");
      return;
    }

    const { url } = await res.json();

    // ✅ Correct redirect method (2025)
    window.location.href = url;
  }

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>

      <div className="border rounded-xl p-6">
        <h2 className="text-xl font-semibold">Pro</h2>
        <p className="text-gray-500 mb-4">
          Unlimited documents, quizzes, mind maps
        </p>
        <p className="text-3xl font-bold mb-4">$10 / month</p>

        <button
          onClick={handleSubscribe}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
