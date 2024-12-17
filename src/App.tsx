import './App.scss';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import HomeComponent from './component/Home';
import NotFoundComponent from './component/NotFound';
import AboutComponent from './component/About';
import { Container } from 'react-bootstrap';
import Footer from './component/Footer.tsx';
import CategoryListComponent from './component/category/CategoryList.tsx';
import ProductListComponent from './component/product/ProductList.tsx';
import ProductDetailViewComponent from './component/product/ProductDetailView.tsx';
import BasketListComponent from './component/basket/BasketList.tsx';
import BasketNavigation from './component/basket/BasketNavigation.tsx';
import { useState } from 'react';
import { BasketItem } from './component/basket/BasketSingleton.tsx';
import OrderConfirmationComponent from "./component/checkout/OrderConfirmation.tsx";
import CheckoutComponent from "./component/checkout/Checkout.tsx";

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
    const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

    return (
        <Router>
            <div>
                <nav className="nav">
                    <NavLink className="nav-link" to={ROUTES.HOME}>Home</NavLink>
                    <NavLink className="nav-link" to="/neco1">Item 2</NavLink>
                    <NavLink className="nav-link" to="/neco2">Item 3</NavLink>
                    <NavLink className="nav-link" to="/neco3">Item 4</NavLink>
                    <NavLink className="nav-link" to={ROUTES.ABOUT}>About</NavLink>
                    <NavLink className="nav-link" to={ROUTES.CATEGORIES}>Categories</NavLink>
                    <BasketNavigation basketItems={basketItems}></BasketNavigation>
                </nav>

                <Container>
                    <Routes>
                        <Route path={ROUTES.HOME} element={<HomeComponent />} />
                        <Route path={ROUTES.ABOUT} element={<AboutComponent />} />
                        <Route path={ROUTES.CATEGORIES} element={<CategoryListComponent />} />
                        <Route path={ROUTES.PRODUCTS} element={<ProductListComponent basketItemsInput={setBasketItems} />} />
                        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailViewComponent />} />
                        <Route path={ROUTES.BASKET} element={<BasketListComponent />} />
                        <Route path={ROUTES.CHECKOUT} element={<CheckoutComponent/>} />
                        <Route path={ROUTES.ORDER_CONFIRMATION} element={<OrderConfirmationComponent />} />
                        <Route path={ROUTES.NOT_FOUND} element={<NotFoundComponent />} />
                    </Routes>
                </Container>

                <Footer />
            </div>
        </Router>
    );
}

export default App;