import React from "react";
import "../css/base.scss"
import RecentAnime from "../components/home/RecentAnime.tsx";
import "../css/home.scss"
import {Header} from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

class Home extends React.Component{

    componentDidMount(){
        document.title = "Animefoda"
    }

    render(){
        return(
            <>
                <Header/>
                <RecentAnime/>
                <Footer/>
            </>
        )
    }
}

export default Home;