// api.ts

const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => {
            console.log("Now Playing Movies Response:", response); // 응답 확인
            return response.json();
        }
    );
}

// 최신 영화 목록
export const getLatestMovies = async () => {
    const response = await fetch(
        `${BASE_PATH}/movie/latest?api_key=${API_KEY}`
    );
    console.log("Latest Movies Response:", response); // 응답 확인
    if (!response.ok) {
        throw new Error("Failed to fetch latest movies");
    }
    return response.json();
};

// 최고 평점 영화 목록
export const getTopRatedMovies = async () => {
    const response = await fetch(
        `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`
    );
    console.log("Top Rated Movies Response:", response); // 응답 확인
    if (!response.ok) {
        throw new Error("Failed to fetch top rated movies");
    }
    return response.json();
};

// 곧 개봉할 영화 목록
export const getUpcomingMovies = async () => {
    const response = await fetch(
        `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`
    );
    console.log("Upcoming Movies Response:", response); // 응답 확인
    if (!response.ok) {
        throw new Error("Failed to fetch upcoming movies");
    }
    return response.json();
};
