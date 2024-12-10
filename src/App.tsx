import './App.scss'
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import HomeComponent from "./component/Home.tsx";
import NotFoundComponent from "./component/NotFound.tsx";
import AboutComponent from "./component/About.tsx";

function App() {
    return (
        <Router>
            <div>
                <nav>
                        <a href="/">Home</a>
                        <a href="/">Item 2</a>
                        <a href="/">Item 3</a>
                        <a href="/">Item 4</a>
                        <a href="/about">About</a>
                </nav>

                <>
                    <Routes>
                        <Route path="/" element={<HomeComponent/>}/>
                        <Route path="/about" element={<AboutComponent/>}/>
                        <Route path="*" element={<NotFoundComponent/>}/>
                    </Routes>
                </>
            </div>
        </Router>
    )
}

export default App
