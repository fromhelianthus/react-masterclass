import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"; // useHistory 사용
import {
    getLatestShows,
    getAiringTodayShows,
    getPopularShows,
    getTopRatedShows,
} from "../api";

function Tv() {
    const [latestShows, setLatestShows] = useState<any[]>([]);
    const [airingToday, setAiringToday] = useState<any[]>([]);
    const [popularShows, setPopularShows] = useState<any[]>([]);
    const [topRatedShows, setTopRatedShows] = useState<any[]>([]);
    const [selectedShow, setSelectedShow] = useState<any | null>(null);
    const history = useHistory(); // useHistory 사용

    useEffect(() => {
        const fetchData = async () => {
            try {
                const latest = await getLatestShows();
                const airingTodayData = await getAiringTodayShows();
                const popular = await getPopularShows();
                const topRated = await getTopRatedShows();

                setLatestShows(latest.results || []);
                setAiringToday(airingTodayData.results || []);
                setPopularShows(popular.results || []);
                setTopRatedShows(topRated.results || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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
                            <div
                                onClick={() => {
                                    setSelectedShow(show);
                                    history.push(`/tv/${show.id}`); // useHistory 사용
                                }}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                                    alt={show.name}
                                    style={{
                                        width: "100%",
                                        borderRadius: "8px",
                                    }}
                                />
                                <h3>{show.name}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No shows available</p>
                )}
            </div>
        </div>
    );

    const closeModal = () => {
        setSelectedShow(null);
        history.push("/tv"); // URL 변경
    };

    return (
        <div style={{ backgroundColor: "black", padding: "20px" }}>
            {renderSlider(latestShows, "Latest Shows")}
            {renderSlider(airingToday, "Airing Today")}
            {renderSlider(popularShows, "Popular Shows")}
            {renderSlider(topRatedShows, "Top Rated Shows")}

            {selectedShow && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "80%",
                            maxWidth: "600px",
                            cursor: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{selectedShow.name}</h2>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${selectedShow.poster_path}`}
                            alt={selectedShow.name}
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                marginBottom: "10px",
                            }}
                        />
                        <p>{selectedShow.overview}</p>
                        <button
                            onClick={closeModal}
                            style={{
                                backgroundColor: "#ff5e57",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                border: "none",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tv;
