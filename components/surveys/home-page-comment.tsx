"use client";
import { useState } from "react";

export default function HomePageCommentForm() {
  const [form, setForm] = useState({
    pfp: "",
    occupation: "",
    name: "",
    comment: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: handle actual submission (API, etc.)
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto p-6 bg-card border border-border rounded-none flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        Profile Picture URL
        <input
          type="url"
          name="pfp"
          value={form.pfp}
          onChange={handleChange}
          required
          placeholder="https://..."
          className="input input-bordered rounded-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        Occupation
        <input
          type="text"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          required
          placeholder="Your occupation"
          className="input input-bordered rounded-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="input input-bordered rounded-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        Comment
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          required
          placeholder="Your comment for the home page"
          className="textarea textarea-bordered min-h-[80px] rounded-none"
        />
      </label>
      <button type="submit" className="btn btn-primary w-full rounded-none">Submit</button>
      {submitted && (
        <div className="text-green-600 text-center mt-2">Thank you for your comment!</div>
      )}
    </form>
  );
}
