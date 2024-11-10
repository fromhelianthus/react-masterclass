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
            console.log("Now Playing Movies Response:", response);
            return response.json();
        }
    );
}

export const getLatestMovies = async () => {
    const response = await fetch(
        `${BASE_PATH}/movie/latest?api_key=${API_KEY}`
    );
    console.log("Latest Movies Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch latest movies");
    }
    return response.json();
};

export const getTopRatedMovies = async () => {
    const response = await fetch(
        `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`
    );
    console.log("Top Rated Movies Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch top rated movies");
    }
    return response.json();
};

export const getUpcomingMovies = async () => {
    const response = await fetch(
        `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`
    );
    console.log("Upcoming Movies Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch upcoming movies");
    }
    return response.json();
};

// TV Show
export const getLatestShows = async () => {
    const response = await fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`);
    console.log("Latest Shows Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch latest shows");
    }
    return response.json();
};

export const getAiringTodayShows = async () => {
    const response = await fetch(
        `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`
    );
    console.log("Airing Today Shows Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch airing today shows");
    }
    return response.json();
};

export const getPopularShows = async () => {
    const response = await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`);
    console.log("Popular Shows Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch popular shows");
    }
    return response.json();
};

export const getTopRatedShows = async () => {
    const response = await fetch(
        `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`
    );
    console.log("Top Rated Shows Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch top-rated shows");
    }
    return response.json();
};

// 특정 TV 쇼 정보 가져오기
export const getTvDetails = async (tvId: number) => {
    const response = await fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`);
    console.log("TV Details Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch TV details");
    }
    return response.json();
};

// Search
export const getMoviesByKeyword = async (keyword: string) => {
    const response = await fetch(
        `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            keyword
        )}`
    );
    console.log("Movies by Keyword Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch movies");
    }
    return response.json();
};

export const getTvByKeyword = async (keyword: string) => {
    const response = await fetch(
        `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
            keyword
        )}`
    );
    console.log("TV by Keyword Response:", response);
    if (!response.ok) {
        throw new Error("Failed to fetch TV shows");
    }
    return response.json();
};
