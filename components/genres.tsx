import React from "react";
interface IGenres {
  index: number;
  name: string;
  length: number | undefined;
}

const Genres: React.FC<IGenres> = ({ index, name, length }) => {
  return (
    <div className="flex items-center gap-4 text-white hover:text-red-600 cursor-pointer">
      <div className="text-lg font-bold">{name}</div>
      <div className="text-white">{index + 1 !== length ? "/" : ""}</div>
    </div>
  );
};

export default Genres;
