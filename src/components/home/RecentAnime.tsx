import React from "react";
import type {UserContext} from "../../contexts/UserContext.tsx";

class RecentAnime extends React.PureComponent{
    declare context: React.ContextType<typeof UserContext>;

    componentDidMount() {
    }

    render(){
        return(
            <div>

            </div>
        )
    }
}
export default RecentAnime;