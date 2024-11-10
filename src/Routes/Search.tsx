// Search.tsx

import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMoviesByKeyword, getTvByKeyword } from "../api";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

interface TVShow {
    id: number;
    name: string;
    poster_path: string;
}

const SearchResult = styled.h2`
    font-size: 30px;
    font-weight: 600;
    margin-top: 100px;
    margin-bottom: 20px;
`;

const Subtitle = styled.h3`
    font-size: 26px;
    font-weight: 600;
    color: white;
    margin-top: 30px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const Slider = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-wrap: wrap;
    padding-bottom: 10px;
`;

const SliderItem = styled.div`
    min-width: 200px;
    background-color: black;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTvShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (keyword) {
            setLoading(true);

            Promise.all([getMoviesByKeyword(keyword), getTvByKeyword(keyword)])
                .then(([moviesData, tvShowsData]) => {
                    setMovies(moviesData.results);
                    setTvShows(tvShowsData.results);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("데이터를 불러오는 데 실패했습니다.");
                    setLoading(false);
                });
        }
    }, [keyword]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <SearchResult>"{keyword}" 검색 결과</SearchResult>
            <div>
                <Subtitle>Movies</Subtitle>
                <Slider>
                    {movies.map((movie) => (
                        <SliderItem key={movie.id}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                width={200}
                            />
                            <p>{movie.title}</p>
                        </SliderItem>
                    ))}
                </Slider>
            </div>
            <div>
                <Subtitle>TV Shows</Subtitle>
                <Slider>
                    {tvShows.map((show) => (
                        <SliderItem key={show.id}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                alt={show.name}
                                width={200}
                            />
                            <p>{show.name}</p>
                        </SliderItem>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Search;
