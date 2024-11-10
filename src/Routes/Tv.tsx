// Tv.tsx

import React, { useState, useEffect } from "react";
import {
    getLatestShows,
    getAiringTodayShows,
    getPopularShows,
    getTopRatedShows,
} from "../api";

function Tv() {
    // 상태 정의
    const [latestShows, setLatestShows] = useState<any[]>([]);
    const [airingToday, setAiringToday] = useState<any[]>([]);
    const [popularShows, setPopularShows] = useState<any[]>([]);
    const [topRatedShows, setTopRatedShows] = useState<any[]>([]);

    // API 데이터를 받아오는 useEffect 훅
    useEffect(() => {
        const fetchData = async () => {
            try {
                const latest = await getLatestShows();
                const airingTodayData = await getAiringTodayShows();
                const popular = await getPopularShows();
                const topRated = await getTopRatedShows();

                // 결과가 없다면 빈 배열로 처리
                setLatestShows(latest.results || []);
                setAiringToday(airingTodayData.results || []);
                setPopularShows(popular.results || []);
                setTopRatedShows(topRated.results || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // 컴포넌트 마운트 시 데이터 로드

    // 슬라이더 아이템을 렌더링하는 함수
    const renderSlider = (shows: any[], title: string) => (
        <div style={{ marginBottom: "20px" }}>
            <h2>{title}</h2>
            <div style={{ display: "flex", overflowX: "scroll", gap: "10px" }}>
                {shows.length > 0 ? (
                    shows.map((show) => (
                        <div
                            key={show.id}
                            style={{
                                minWidth: "150px",
                                backgroundColor: "black",
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                                alt={show.name}
                                style={{ width: "100%", borderRadius: "8px" }}
                            />
                            <h3>{show.name}</h3>
                        </div>
                    ))
                ) : (
                    <p>No shows available</p>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: "black", padding: "20px" }}>
            {renderSlider(latestShows, "Latest Shows")}
            {renderSlider(airingToday, "Airing Today")}
            {renderSlider(popularShows, "Popular Shows")}
            {renderSlider(topRatedShows, "Top Rated Shows")}
        </div>
    );
}

export default Tv;
