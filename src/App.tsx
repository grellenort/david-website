import './App.scss';
import {BrowserRouter as Router, NavLink, Route, Routes} from 'react-router-dom';
import HomeComponent from './component/Home';
import NotFoundComponent from './component/NotFound';
import AboutComponent from './component/About';
import {Container} from 'react-bootstrap';
import Footer from './component/Footer.tsx';
import CategoryListComponent from './component/category/CategoryList.tsx';
import ProductListComponent from './component/product/ProductList.tsx';
import BasketListComponent from './component/basket/BasketList.tsx';
import BasketNavigation from './component/basket/BasketNavigation.tsx';
import OrderConfirmationComponent from "./component/checkout/OrderConfirmation.tsx";
import CheckoutComponent from "./component/checkout/Checkout.tsx";
import {BasketProvider} from "./component/basket/BasketContext.tsx";
import ProductPage from "./component/product/ProductPage.tsx";

export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CATEGORIES: '/categories',
    PRODUCTS: '/products/:categoryId',
    PRODUCT_DETAIL: '/product-detail/:slug',
    BASKET: '/basket',
    CHECKOUT: '/checkout',
    ORDER_CONFIRMATION: '/order-confirmation',
    NOT_FOUND: '*',
};

function App() {

    return (
        <BasketProvider>
            <Router>
                <div>
                    <nav className="nav">
                        <NavLink className="nav-link" to={ROUTES.HOME}>Home</NavLink>
                        <NavLink className="nav-link" to="/neco1">Item 2</NavLink>
                        <NavLink className="nav-link" to="/neco2">Item 3</NavLink>
                        <NavLink className="nav-link" to="/neco3">Item 4</NavLink>
                        <NavLink className="nav-link" to={ROUTES.ABOUT}>About</NavLink>
                        {/*<NavLink className="nav-link" to={ROUTES.CATEGORIES}>Categories</NavLink>*/}

                        <BasketNavigation></BasketNavigation>

                    </nav>
                    <CategoryListComponent/>

                    <Container>
                        <Routes>
                            <Route path={ROUTES.HOME} element={<HomeComponent/>}/>
                            <Route path={ROUTES.ABOUT} element={<AboutComponent/>}/>
                            {/*<Route path={ROUTES.CATEGORIES} element={<CategoryListComponent />} />*/}

                            <Route path={ROUTES.PRODUCTS}
                                   element={<ProductPage/>}/>
                            <Route path={ROUTES.BASKET} element={<BasketListComponent/>}/>
                            <Route path={ROUTES.CHECKOUT} element={<CheckoutComponent/>}/>
                            <Route path={ROUTES.ORDER_CONFIRMATION} element={<OrderConfirmationComponent/>}/>
                            <Route path={ROUTES.NOT_FOUND} element={<NotFoundComponent/>}/>
                        </Routes>
                    </Container>

                    <Footer/>
                </div>
            </Router>
        </BasketProvider>
    );
}

export default App;