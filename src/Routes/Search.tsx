// Search.tsx

import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import { getMoviesByKeyword, getTvByKeyword } from "../api";

// 영화와 TV 쇼 데이터 타입 정의
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

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    const [movies, setMovies] = useState<Movie[]>([]); // 영화 데이터 타입 정의
    const [tvShows, setTvShows] = useState<TVShow[]>([]); // TV 쇼 데이터 타입 정의
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (keyword) {
            setLoading(true); // 로딩 시작

            // 영화와 TV 프로그램 검색
            Promise.all([getMoviesByKeyword(keyword), getTvByKeyword(keyword)])
                .then(([moviesData, tvShowsData]) => {
                    setMovies(moviesData.results); // 영화 데이터 저장
                    setTvShows(tvShowsData.results); // TV 프로그램 데이터 저장
                    setLoading(false); // 로딩 완료
                })
                .catch((err) => {
                    setError("데이터를 불러오는 데 실패했습니다.");
                    setLoading(false);
                });
        }
    }, [keyword]);

    // 로딩 중, 에러 처리
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    // 슬라이더로 영화와 TV 프로그램 출력
    return (
        <div>
            <h2>검색 결과: {keyword}</h2>
            <div>
                <h3>Movies</h3>
                <div className="slider">
                    {movies.map((movie) => (
                        <div key={movie.id} className="slider-item">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                width={200}
                            />
                            <p>{movie.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3>TV Shows</h3>
                <div className="slider">
                    {tvShows.map((show) => (
                        <div key={show.id} className="slider-item">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                alt={show.name}
                                width={200}
                            />
                            <p>{show.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;
