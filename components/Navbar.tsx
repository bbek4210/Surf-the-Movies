"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

 
  const searchMovies = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim()) {
      const searchQuery = `/?movie=${encodeURIComponent(input.trim())}`;
      router.push(searchQuery);
      setInput("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-4   shadow-md top-0 z--50">
      <div className=" container flex mx-auto justify-between items-center">
        <Link href="/">
          <div className="text-3xl font-bold text-white hover:text-yellow-400 transition-all">
            Surf Movies
          </div>
        </Link>

        <form onSubmit={searchMovies} className="flex items-center space-x-2">
          <input
            className="bg-gray-700 pl-4 text-sm rounded-l-lg py-2 outline-none text-white placeholder-gray-300 focus:ring-yellow-400"
            type="text"
            value={input}
            placeholder="Search a movie..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-600 rounded-r-lg text-white py-2 text-sm px-4 hover:bg-red-500 hover:text-white border border-black transition-all"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Navbar;
