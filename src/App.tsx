import * as React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {UserProvider} from "./contexts/UserContext.tsx";
import Home from "./pages/Home.tsx";

class App extends React.Component {


    render() {
        return (
            <>
                {/*<Header/>*/}
                <Router>
                    <UserProvider>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                        </Routes>
                    </UserProvider>
                </Router>
                {/*<Footer/>*/}
            </>
        )
    }
}

export default App