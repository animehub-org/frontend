import React from "react";
import type {UserContext} from "../../contexts/UserContext.tsx";
import {getFromApi} from "../../functions/requestFunctions.ts";
import type {AnimeSummary} from "../../types/Anime.ts";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faPlus} from "@fortawesome/free-solid-svg-icons";
import {CDN_URL} from "../../Consts.ts";
import {getEpTime, trim} from "../../functions/stringFunctions.ts";

interface AnimePosterProps {
    anime: AnimeSummary;
}

class AnimePoster extends React.PureComponent<AnimePosterProps>{
    render() {
        const anime = this.props.anime;
        return (
            <Link to={`/anime/${anime.id}`} className="anime-poster">
                <div className="highlight">
                    <div className="hover"/>
                    <div className="img">
                        <img src={`${CDN_URL}/ani/img/${anime.id}/${anime.id}.jpg`} alt={anime.name} />
                    </div>
                    <div className="body">
                        <div className='time'>
                            <span>{getEpTime(anime.averageEpTime)}</span>
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className="genres">
                            {anime.genre.map((genre, i) => (
                                <span className="genre" key={i}>{genre}</span>
                            ))}
                        </div>
                        <span className="title">{anime.name}</span>
                        <span className='description'>{trim(anime.description)}</span>
                    </div>
                </div>
            </Link>
        )
    }
}

interface RecentAnimeState {
    animes: AnimeSummary[];
}

class RecentAnime extends React.PureComponent<object,RecentAnimeState>{
    declare context: React.ContextType<typeof UserContext>;
    state: RecentAnimeState = {
        animes: [],
    }

    async componentDidMount() {
        const res = await getFromApi<AnimeSummary[]>("/anime/all?summary=true")
        if(res.data.success){
            this.setState({animes: res.data.data})
        }
    }

    render(){
        const {animes} = this.state;
        return(
            <div className="recent-anime">
                <div className="recent-anime-title">
                    <h2>Animes adicionados recentemente</h2>
                    <Link to="/anime/releases">
                        <FontAwesomeIcon icon={faPlus}/>
                        Ver mais
                    </Link>
                </div>
                <div className="recent-anime-container">
                    {animes.map((anime, i) =>(
                        <AnimePoster key={i} anime={anime} />
                    ))}
                </div>
            </div>
        )
    }
}
export default RecentAnime;