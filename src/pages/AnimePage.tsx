import BasePage, {type BaseState} from "./BasePage.tsx";
import type {Anime} from "../types/Anime.ts";
import {UserContext} from "../contexts/UserContext.tsx";
import React from "react";
import {withParams} from "../functions/withParams.tsx";
import {formatNewLines, getEpTime} from "../functions/stringFunctions.ts";
import "../css/animePage.scss"
import LikeButton from "../components/LikeButton.tsx";
import {Link} from "react-router-dom";
import type {Producer} from "../types/Producer.ts";
import {getMonthName} from "../functions/dateFunctions.ts";
import {type State as AnimeState, type StateName, StateNames} from "../types/State.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faPlay, faStar} from "@fortawesome/free-solid-svg-icons";
import {CDN_URL} from "../Consts.ts";
import type {EpisodeDTO} from "../types/Episode.ts";

type GenreProps = {
    genre:string
}
class Genre extends React.PureComponent<GenreProps>{
    render(){

        return(
            <Link to={`/genre/${this.props.genre}`}>
                <div className="genre">
                    <p>{this.props.genre}</p>
                </div>
            </Link>
        )
    }
}

type ProdType = "producer"|"creator"|"studio"
type ProducerProps = {
    producer:Producer,
    type:ProdType
}

class ProducerComponent extends React.PureComponent<ProducerProps>{
    render(){
        return(
            <Link to={`/${this.props.type}/${this.props.producer.id}`}>
                <div className="genre">
                    <p>{this.props.producer.name}</p>
                </div>
            </Link>
        )
    }
}

type EpisodeParams = {
    episode: EpisodeDTO
}

class EpisodeLink extends React.PureComponent<EpisodeParams>{
    render(){
        const episode = this.props.episode
        return(
            <div className="episode" key={episode.epIndex}>
                <span>{episode.name}</span>
                <div>
                    {/*<button className={epList?"selected":""} onClick={!epList?handleWatchedd:()=>{}}><FontAwesomeIcon icon={epList?faEye:faEyeSlash}/> Visto</button>*/}
                    <Link to={`/anime/${episode.animeId}/watch/${episode.seasonId}/${episode.id}`}><button><FontAwesomeIcon icon={faPlay}/> Assistir</button></Link>
                    <Link to={`/anime/${episode.animeId}/download/${episode.seasonId}/${episode.id}`}><button ><FontAwesomeIcon icon={faDownload}/> Download</button></Link>
                </div>
            </div>
        )
    }
}


type Params = {
    id: string
}

type Props = {
    params: Params
}

type State = BaseState & {
    anime: Anime | null;
    selectedSeasonId: string;
}

class AnimePage extends BasePage<Props, State>{
    declare context: React.ContextType<typeof UserContext>;
    state: State = {
        anime: null,
        err: false,
        errReason: "",
        selectedSeasonId: "",
    };

    async componentDidMount(){
        const anime = await super.getAnime(this.props.params.id)
        if (!anime) return; // já setou err dentro do getAnime

        this.setState({
            anime,
            selectedSeasonId: anime.seasons[0].id
        });
        document.title = `Animefoda ${anime.name}`
    }

    private stateTypeToStateEnum(input: AnimeState): StateName{
        const key = input.name as keyof typeof StateNames; // ex: "COMPLETED"
        const enumValue = StateNames[key];
        if (!enumValue) {
            throw new Error(`Estado inválido recebido: ${input.name}`);
        }
        return enumValue;
    }

    protected renderContent(): React.ReactNode {
        const { anime, selectedSeasonId } = this.state;
        const releaseDate = anime? new Date(anime.releaseDate) : new Date();


        if (!anime) return <p>Carregando anime...</p>;

        return(
            <div className="anime-page">
                <p className="small">Anime - Duração média: {
                    anime.averageEpTime ? getEpTime(anime.averageEpTime) : getEpTime(0)
                }</p>
                <div className="content-left">

                    <h2 className="title">{anime.name}</h2>

                    <div style={{display: "inline"}}>
                        <p className="details small">Ano: {new Date(anime.releaseDate).getFullYear()}</p>
                        <p className="details small">Qualidade: {anime.quality}</p>
                    </div>

                    <LikeButton/>

                    <p className="small description" dangerouslySetInnerHTML={{ __html: formatNewLines(anime.description) }} />

                    <div className="details-div">
                        <p className="inline-details">Gêneros:</p>
                        <div className="inline-details">
                            {anime.genre.map((v,i)=>(
                                <Genre genre={v} key={i}/>
                            ))}
                        </div>
                    </div>


                    <div className="details-div">
                        <p className="inline-details">Produtores: </p>
                        <div className="inline-details">
                            {anime.producers.map((v,i)=>(
                                <ProducerComponent producer={v} type={"producer"} key={i}/>
                            ))}
                        </div>
                    </div>

                    <div className="details-div">
                        <p className="inline-details">{anime.creators.length>1?"Criador: ":"Criadores: "}</p>
                        <div className="inline-details">
                            {anime.creators.map((v,i)=>(
                                <ProducerComponent producer={v} type={"creator"} key={i}/>
                            ))}
                        </div>
                    </div>

                    <div className="details-div">
                        <p className="inline-details">{anime.creators.length>1?"Estudio: ":"Estudios: "} </p>
                        <div className="inline-details">
                            {anime.studios.map((v,i)=>(
                                <ProducerComponent producer={v} type={"studio"} key={i}/>
                            ))}
                        </div>
                    </div>

                    <div>
                        {anime.name2? (<p>Nome alternativo: {anime.name2}</p>):<></>}
                        <p>Idioma: {anime.language}</p>
                        <p>Data de lançamento:
                            <b>{releaseDate.getDate().toString()}</b> de
                            <b> {getMonthName(releaseDate, false)}</b> de
                            <b> {releaseDate.getFullYear()}</b>
                        </p>
                    </div>

                    <p>Estado: <b>{this.stateTypeToStateEnum(anime.state)}</b></p>
                    <p>Nota: <b>{anime.rating}</b> <FontAwesomeIcon icon={faStar}/></p>
                </div>


                <div className="content-right">
                    <div className="img">
                        <img src={`${CDN_URL}/ani/img/${anime.id}/${anime.id}.jpg`}/>
                    </div>
                </div>

                <div className="seasons">
                    <select
                        className="season-select"
                        value={selectedSeasonId}
                        onChange={(e)=>{
                            this.setState({selectedSeasonId: e.target.value});
                        }}
                    >
                        {anime.seasons.sort((a,b)=>a.index-b.index).map(season=>(
                            <option key={season.index} value={season.id}>{season.name}</option>
                        ))}
                    </select>
                </div>

                <div className="episodes">
                    {anime.seasons.map((season)=>(
                        <div style={{display: season.id === selectedSeasonId ? 'block' : 'none'}} key={season.index}>
                            {season.episodes.sort((a,b)=>a.epIndex-b.epIndex).map(ep=>(
                                <EpisodeLink episode={ep} key={ep.epIndex}/>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withParams<Params,object>(AnimePage);