"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import ReactPlayer from "react-player";
import { BsPlayFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useSearchParams } from "next/navigation";

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

interface HomeProps {
  movie: IMovie;
  recommendations: IRelatedMovie[];
}

const Home = ({
  movie: initialMovie,
  recommendations: initialRecommendations,
}: HomeProps) => {
  const searchParams = useSearchParams();
  const movieQuery = searchParams.get("movie");

  const [movie, setMovie] = useState<IMovie | null>(initialMovie);
  const [recommendations, setRecommendations] = useState<IRelatedMovie[]>(
    initialRecommendations
  );
  const [showPlayer, setShowPlayer] = useState(false);

  const trailer = movie?.videos?.results?.find(
    (video) => video.type === "Trailer"
  )?.key;

  useEffect(() => {
    const fetchMovieByQuery = async () => {
      if (!movieQuery) return;

      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        // Fetch movies based on the search query
        const searchResponse = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: apiKey,
              query: movieQuery,
              append_to_response: "videos",
            },
          }
        );

        const movies = searchResponse.data.results;

        if (movies && movies.length > 0) {
          const movie = movies[0];

          // Fetch recommendations for the selected movie
          const recommendationsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/recommendations`,
            {
              params: { api_key: apiKey },
            }
          );

          setMovie(movie);
          setRecommendations(recommendationsResponse.data.results);
        } else {
          setMovie(null);
          setRecommendations([]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch movie data based on search query:",
          error
        );
      }
    };

    fetchMovieByQuery();
  }, [movieQuery]);

  const handleRelatedMovieClick = async (movieId: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          params: { api_key: apiKey, append_to_response: "videos" },
        }
      );

      const recommendationsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations`,
        {
          params: { api_key: apiKey },
        }
      );

      setMovie(movieResponse.data);
      setRecommendations(recommendationsResponse.data.results);
    } catch (error) {
      console.error("Failed to fetch related movie data:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-800 to-purple-500 relative px-4 md:px-0">
      <div className="mx-auto min-h[calc(100vh-77px)] flex flex-col gap-10 relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:mx-10 py-20">
          <div className="mx-auto flex-none relative">
            <Image
              alt="movie-poster"
              width={700}
              height={700}
              src={
                movie?.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
                  : "/image.png"
              }
              className="w-[300px] object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
          <div className="space-y-6">
            {movie ? (
              <>
                <div className="uppercase text-[26px] md:text-[34px] font-medium text-yellow-400">
                  {movie?.title}
                </div>
                <div className="flex gap-4 flex-wrap">
                  {movie?.genres?.map((genre) => (
                    <div
                      key={genre?.id}
                      className="text-gray-200 bg-purple-600 px-3 py-1 rounded"
                    >
                      {genre?.name}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-white">
                  <div className="text-blue-400">
                    Language: {movie?.original_language?.toUpperCase()}
                  </div>
                  <div className="text-green-400">
                    Release: {movie?.release_date}
                  </div>
                  <div className="text-pink-400">
                    Runtime: {movie?.runtime} MIN.
                  </div>
                  <div className="text-yellow-300">
                    Rating: {movie?.vote_average} ⭐
                  </div>
                </div>

                <div className="pt-14 space-y-2 pr-4 text-white">
                  <div className="text-red-400 font-semibold">OVERVIEW:</div>
                  <div className="text-gray-200">{movie?.overview}</div>
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
              </>
            ) : (
              <div className="text-center text-gray-200">
                No movie found for "{movieQuery}".
              </div>
            )}
          </div>
        </div>

        <div className="py-10">
          <h2 className="text-2xl text-white font-bold mb-4">Related Movies</h2>
          <div className="flex gap-4 overflow-x-auto">
            {recommendations.map((relatedMovie) => (
              <div
                key={relatedMovie.id}
                className="flex-none w-[150px] hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleRelatedMovieClick(relatedMovie.id)}
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

        {showPlayer && (
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
                url={`https://www.youtube.com/watch?v=${trailer}`}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: "0", left: "0" }}
                controls
                playing={showPlayer}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
