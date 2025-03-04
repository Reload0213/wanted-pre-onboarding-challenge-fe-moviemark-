"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getMovieDetail } from "@/api/movie";

import MovieBookmark from "../MovieCard/MovieBookmark";
import MovieRating from "../MovieCard/MovieRating";
import MovieTitle from "../MovieCard/MovieTitle";

interface MovieDetailProps {
  movieId: string;
}

export default function MovieDetail({ movieId }: MovieDetailProps) {
	const { data: movie } = useQuery({
		queryKey: ["movieDetail", movieId],
		queryFn: () => getMovieDetail(movieId),
	});

	if (!movie) return;

	return (
		<div className="flex flex-col md:flex-row">
			<div className="relative w-[250px] h-[400px] rounded-lg overflow-hidden">
				<Image
					src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
					alt={movie?.korean_title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<div className="md:w-2/3 w-full items-center md:items-start flex flex-col px-6 gap-4">
				<MovieTitle ko_title={movie.korean_title} en_title={movie.title} />
				<MovieRating value={movie.vote_average} size='lg' />
				<MovieBookmark movieId={movie.id} isBookmarked={movie.is_bookmarked} />
				<h1 className="mt-2 heading-1 font-medium text-white">{movie?.overview}</h1>
			</div>
		</div>
	);
}