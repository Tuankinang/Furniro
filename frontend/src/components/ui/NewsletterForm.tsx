"use client";

import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Your Email Address"
        required
        className="flex-1 border-b border-black bg-transparent text-sm text-black placeholder-gray-400 focus:outline-none py-1 pr-2"
      />
      <button
        type="submit"
        className="text-sm font-semibold text-black border-b border-black pb-1 ml-4 hover:text-[#B88E2F] hover:border-[#B88E2F] transition-colors duration-200 whitespace-nowrap"
      >
        SUBSCRIBE
      </button>
    </form>
  );
};

export default NewsletterForm;
