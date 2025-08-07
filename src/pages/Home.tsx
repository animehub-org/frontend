import {Header} from "../components/Header.tsx";
import React from "react";
import "../css/base.scss"
import Footer from "../components/Footer.tsx";

class Home extends React.Component{

    componentDidMount(){
        document.title = "Animefoda"
    }

    render(){
        return(
            <>
                <Header></Header>
                {/*<p>aaaaa</p>*/}
                <div className="main-home"></div>
                <Footer/>
            </>
        )
    }
}

export default Home;