import './App.scss'
import {Route, BrowserRouter as Router, Routes, NavLink} from "react-router-dom";
import HomeComponent from "./component/Home";
import NotFoundComponent from "./component/NotFound";
import AboutComponent from "./component/About";
import {Container} from "react-bootstrap";
import Footer from "./component/Footer.tsx";
import CategoryListComponent from "./component/category/CategoryList.tsx";
import ProductListComponent from "./component/product/ProductList.tsx";
import ProductDetailViewComponent from "./component/product/ProductDetailView.tsx";

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
                    <NavLink className="nav-link" to="/categories">Categories</NavLink>
                </nav>

                <Container>
                    <Routes>
                        <Route path="/" element={<HomeComponent/>}/>
                        <Route path="/about" element={<AboutComponent/>}/>
                        <Route path="/categories" element={<CategoryListComponent/>}/>
                        <Route path="/products/:categoryId" element={<ProductListComponent/>}/>
                        <Route path="/product-detail/:slug" element={<ProductDetailViewComponent/>}/>
                        <Route path="*" element={<NotFoundComponent/>}/>
                    </Routes>
                </Container>

                <Footer></Footer>
            </div>
        </Router>
    )
}

export default App
