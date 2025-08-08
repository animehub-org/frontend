import React from "react";
import "../css/likeButton.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";


type State = {
    isLiked: boolean;
}

class LikeButton extends React.PureComponent<object, State>{

    state: State ={
        isLiked: false
    };

    handleLike = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        this.setState(prev=>({isLiked: !prev.isLiked}));
    }

    render(){
        const {isLiked} = this.state
        return(
            <button className={`like-button ${isLiked?"selected":""}`} onClick={this.handleLike}>
                <FontAwesomeIcon icon={faHeart}/>
            </button>
        )
    }
}
export default LikeButton;