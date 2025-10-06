import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { searchMovies, type MoviesResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isFetching, isError, error } =
    useQuery<MoviesResponse>({
      queryKey: ["movies", query, page],
      queryFn: ({ signal }) =>
        query
          ? searchMovies(query, page, signal)
          : Promise.resolve(undefined as unknown as MoviesResponse),
      enabled: !!query,
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    });

  useEffect(() => {
    if (!isLoading && data && page === 1 && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, page]);

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  function handleSearch(q: string) {
    setQuery(q.trim());
    setPage(1);
    setSelectedMovie(null);
  }

  const errMsg =
    error instanceof Error ? error.message : "Something went wrong";

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      <main style={{ maxWidth: 1200, margin: "20px auto", padding: "0 16px" }}>
        {isError ? (
          <ErrorMessage message={errMsg} />
        ) : isLoading && !data ? (
          <Loader />
        ) : (
          <>
            {movies.length > 0 && (
              <MovieGrid
                movies={movies}
                onSelect={(movie) => setSelectedMovie(movie)}
              />
            )}

            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}

            {isFetching && data && (
              <div style={{ textAlign: "center" }}>Loading…</div>
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
