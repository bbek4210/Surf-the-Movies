"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Genres from "./genres";
import { BsPlayFill } from "react-icons/bs";
import { FaBullseye } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import ReactPlayer from "react-player";
interface IMovie {
  poster_path: string;
  title: string;
  genres: [
    {
      name: string;
      id: string;
    }
  ];
  original_language: string;
  release_date: string;
  runtime: string;
  vote_average: string;
  overview: string;
  videos: {
    results: [
      {
        type: string;
        key: string;
      }
    ];
  };
}

interface IRelatedMovie {
  id: number;
  title: string;
  poster_path: string;
}

const Home = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [movie, setMovie] = useState<IMovie>();
  const [showPlayer, setShowPlayer] = useState(false);
  const [trailer, setTrailer] = useState("");
  const [relatedMovies, setRelatedMovies] = useState<IRelatedMovie[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setIsImageLoading(true);

    let searchMovie = searchParams.get("movie");
    if (searchMovie === null) {
      searchMovie = "Iron Man";
    }

    axios
      .get(`http://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: process.env.NEXT_PUBLIC_API_KEY,
          query: searchMovie,
        },
      })
      .then((res) => {
        const movieId = res?.data?.results[0]?.id;

        axios
          .get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&append_to_response=videos`
          )
          .then((res) => {
            setMovie(res?.data);
            setIsImageLoading(false);
            setIsLoading(false);

            axios
              .get(
                `https://api.themoviedb.org/3/movie/${movieId}/recommendations`,
                {
                  params: { api_key: process.env.NEXT_PUBLIC_API_KEY },
                }
              )
              .then((res) => {
                setRelatedMovies(res.data.results);
              });
          });
      });
  }, [searchParams]);

  useEffect(() => {
    const trailerIndex = movie?.videos?.results?.findIndex(
      (element) => element.type === "Trailer"
    );

    const trailerURL = `https://wwww.youtube.com/watch?v=${
      movie?.videos?.results[trailerIndex || 0]?.key
    }`;
    setTrailer(trailerURL);
  }, [movie]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-800 to-purple-500 relative px-4 md:px-0">
      {isLoading && <Loading />}

      <div className="mx-auto min-h[calc(100vh-77px)] flex flex-col gap-10  relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:mx-10 py-20">
          <div className="mx-auto flex-none relative">
            <Image
              alt="movie-poster"
              width={700}
              height={700}
              src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
              className="w-[300px] object-cover rounded-lg shadow-lg "
              onLoadingComplete={() => setIsImageLoading(false)}
              priority
            />
            {isImageLoading && <Loading />}
          </div>
          <div className="space-y-6">
            <div className="uppercase text-[26px] md:text-[34px] font-medium text-yellow-400">
              {" "}
              {movie?.title}
            </div>
            <div className="flex gap-4 flex-wrap">
              {movie?.genres?.map((genre, index) => (
                <Genres
                  key={genre?.id}
                  index={index}
                  length={movie?.genres?.length}
                  name={genre?.name}
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-white">
              <div className="text-blue-400">
                Language:{"  "}
                {movie?.original_language?.toUpperCase()}
              </div>
              <div className="text-green-400">
                Release:{"  "}
                {movie?.release_date}
              </div>
              <div className="text-pink-400">
                Runtime:{"  "}
                {movie?.runtime} MIN.
              </div>
              <div className="text-yellow-300">
                Rating:{"  "}
                {movie?.vote_average} ⭐
              </div>
            </div>

            <div className="pt-14 space-y-2 pr-4 text-white">
              <div className="text-red-400 font-semibold">OVERVIEW:</div>
              <div className=" text-gray-200lg:line-clamp-4">
                {movie?.overview}
              </div>
            </div>
            <div
              className="inline-block pt-6 cursor-pointer"
              onClick={() => setShowPlayer(true)}
            >
              <div className="flex gap-2 items-center bg-white text-black px-4 py-2 mb-6 hover:bg-red-600">
                <BsPlayFill size={24} />
                Watch Trailer
              </div>
            </div>
          </div>
        </div>

        <div className="py-10">
          <h2 className="text-2xl text-white font-bold mb-4">Related Movies</h2>
          <div className="flex gap-4 overflow-x-auto">
            {relatedMovies.map((relatedMovie) => (
              <div
                key={relatedMovie.id}
                className="flex-none w-[150px] hover:scale-105 transition-transform duration-300"
              >
                <Image
                  alt={relatedMovie.title}
                  width={150}
                  height={225}
                  src={`https://image.tmdb.org/t/p/w500/${relatedMovie.poster_path}`}
                  className="rounded-lg shadow-md"
                />
                <p className="text-sm text-center text-gray-200 mt-2">
                  {relatedMovie.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`absolute top-3 inset-x-[7%] md:inset-x-[13%] rounded overflow-hidden transition duration-1000 ${
            showPlayer ? "opacity-100 z-50" : "opacity-0 -z-10"
          }`}
        >
          <div className="flex items-center justify-between bg-black text-white p-3">
            <span className="font-semibold">Playing Trailer</span>
            <div
              className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg opacity-50 hover:opacity-75 hover:bg-gray-700"
              onClick={() => setShowPlayer(false)}
            >
              <IoMdClose className="h-5" />
            </div>
          </div>
          <div className="relative pt-[56%]">
            <ReactPlayer
              url={trailer}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: "0", left: "0" }}
              controls={true}
              playing={showPlayer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
