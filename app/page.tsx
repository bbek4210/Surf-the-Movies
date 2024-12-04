


import React, { Suspense } from "react";
import Home from "@/components/Home";
import axios from "axios";

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

const fetchData = async () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const movieName = "Iron Man"; 
  const searchResponse = await axios.get(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: { api_key: apiKey, query: movieName },
    }
  );

  const movieId = searchResponse?.data?.results[0]?.id || null;

  if (!movieId) {
    throw new Error("Movie not found");
  }

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

  return {
    movie: movieResponse.data as IMovie,
    recommendations: recommendationsResponse.data.results as IRelatedMovie[],
  };
};

const Page = async () => {
  const { movie, recommendations } = await fetchData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-gradient-to-br from-gray-900 via-purple-800 to-purple-500 h-screen">
        <div className="container mx-auto p-4 pt-6">
          <Home movie={movie} recommendations={recommendations} />
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
