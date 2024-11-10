import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
    getMovies,
    getLatestMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    IGetMoviesResult,
    IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useState } from "react";

const Wrapper = styled.div`
    background: black;
    padding-bottom: 200px;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 66px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -80,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
};

const offset = 6;

function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>(
        "/movies/:movieId"
    );
    const { scrollY } = useViewportScroll();

    // getMovies 요청 (기존 코드)
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );

    // 추가한 API 요청들
    const { data: latestMoviesData } = useQuery<IGetMoviesResult>(
        "latestMovies",
        getLatestMovies
    );
    const { data: topRatedMoviesData } = useQuery<IGetMoviesResult>(
        "topRatedMovies",
        getTopRatedMovies
    );
    const { data: upcomingMoviesData } = useQuery<IGetMoviesResult>(
        "upcomingMovies",
        getUpcomingMovies
    );

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        console.log(`Clicked movie ID: ${movieId}`);
        history.push(`/movies/${movieId}`);
    };
    const onOverlayClick = () => history.push("/");
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => movie.id === +bigMovieMatch.params.movieId
        );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    {/* 현재 상영중인 영화 */}
                    <Banner
                        onClick={incraseIndex}
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>

                    {/* 추가로 받은 영화 데이터들 (예: 최신 영화) */}
                    <div>
                        <h3>Latest Movies</h3>
                        <Row
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "tween", duration: 1 }}
                        >
                            {latestMoviesData?.results?.map((movie: IMovie) => (
                                <Box
                                    key={movie.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    onClick={() => onBoxClicked(movie.id)}
                                    transition={{ type: "tween" }}
                                    bgPhoto={makeImagePath(movie.poster_path)}
                                >
                                    <Info variants={infoVariants}>
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>
                    </div>

                    {/* 추가된 데이터 출력 예시: 최고 평점 영화 */}
                    <div>
                        <h3>Top Rated Movies</h3>
                        <Row
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "tween", duration: 1 }}
                        >
                            {topRatedMoviesData?.results?.map(
                                (movie: IMovie) => (
                                    <Box
                                        key={movie.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClicked(movie.id)}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(
                                            movie.poster_path
                                        )}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                )
                            )}
                        </Row>
                    </div>

                    {/* 추가된 데이터 출력 예시: 곧 개봉할 영화 */}
                    <div>
                        <h3>Upcoming Movies</h3>
                        <Row
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "tween", duration: 1 }}
                        >
                            {upcomingMoviesData?.results?.map(
                                (movie: IMovie) => (
                                    <Box
                                        key={movie.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClicked(movie.id)}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(
                                            movie.poster_path
                                        )}
                                    >
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                )
                            )}
                        </Row>
                    </div>

                    {/* 큰 영화 상세 화면 */}
                    <AnimatePresence>
                        {clickedMovie ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    exit={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    initial={{ opacity: 0 }}
                                />
                                <BigMovie
                                    style={{
                                        top: scrollY.get() + 100,
                                    }}
                                    layoutId={clickedMovie.id + ""}
                                >
                                    <BigCover
                                        style={{
                                            backgroundImage: `url(${makeImagePath(
                                                clickedMovie.backdrop_path,
                                                "w500"
                                            )})`,
                                        }}
                                    />
                                    <BigTitle>{clickedMovie.title}</BigTitle>
                                    <BigOverview>
                                        {clickedMovie.overview}
                                    </BigOverview>
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
