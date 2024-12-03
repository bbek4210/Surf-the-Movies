"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const searchMovies = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`?movie=${input}`);
    setInput("");
  };

  return (
    <div className="bg-red-200 py-4 px-4 md:px-0">
      <div className="flex mx-auto justify-between items-center">
        <Link href="/">
          <div className="text-[30px] font-medium">Logo</div>
        </Link>

        <form onSubmit={searchMovies}>
          <div className="space-x-4">
            <input
              className="bg-gray-600 px-4 py-2 outline-none placeholder:text-blue-500"
              type="text"
              value={input}
              placeholder="Search a movie..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-600 text-green-400 py-2 px-4 hover:bg-red-500 hover:text-white border border-black "
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Navbar;
