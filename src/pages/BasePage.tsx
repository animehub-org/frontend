import React from "react";
import axios from "axios";
import type {Anime} from "../types/Anime.ts";
import {getFromApi} from "../functions/requestFunctions.ts";
import "../css/base.scss"
import Footer from "../components/Footer.tsx";
import {Header} from "../components/Header.tsx";

export type BaseProps = {
    params: object
}

export type BaseState = {
    err:boolean,
    errReason:string,
    status?:string,
}

abstract class BasePage<P extends BaseProps, S extends BaseState> extends React.Component<P, S>{

    public constructor(props: P, initialState: S) {
        super(props);
        this.state = initialState;
    }

    protected getError(){
        return (
        <div className="error-wrapper">
            <p className="error"><b>Erro ao carregar a pagina: </b></p>
            <p className="error-reason">{this.state.errReason}</p>
            <p className="error-status">{this.state.status}</p>
        </div>
        )
    }

    protected idNotFound(type:string){
        this.setState({
            err: true,
            errReason:`${type} não encontrado`
        })
    }

    protected async getAnime(id:string):Promise<Anime|null>{
        try {
            return (await getFromApi<Anime|null>(`/anime/${id}`, null)).data.data;
        } catch (error: unknown) {
            let errReason: string = "";
            let status: string = "";
            if (axios.isAxiosError(error)) {
                errReason = error.message
                status = error.code!
                console.error(error);
            } else {
                console.error("Erro desconhecido", error);
            }
            this.setState({
                err: true,
                errReason: "Anime não encontrado ou erro no servidor. - "+ errReason,
                status: status
            });
            return null;
        }
    }

    protected abstract renderContent(): React.ReactNode;

    render(){
        return(
            <>
                <Header/>
                    {this.state.err ? this.getError() : this.renderContent()}
                <Footer/>
            </>
        )
    }
}

export default BasePage;