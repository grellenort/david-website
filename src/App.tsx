import './App.scss'
import {Route, BrowserRouter as Router, Routes, NavLink} from "react-router-dom";
import HomeComponent from "./component/Home";
import NotFoundComponent from "./component/NotFound";
import AboutComponent from "./component/About";

function App() {
    return (
        <Router>
            <div>
                <nav className="nav">
                        <NavLink className="nav-link" to="/">Home</NavLink>
                        <NavLink className="nav-link" to="/neco1">Item 2</NavLink>
                        <NavLink className="nav-link" to="/neco2">Item 3</NavLink>
                        <NavLink className="nav-link" to="/neco3">Item 4</NavLink>
                        <NavLink className="nav-link" to="/about">About</NavLink>
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
