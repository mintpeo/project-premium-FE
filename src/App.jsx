import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home.jsx'
import Header from "./pages/header/Header.jsx";
import Footer from "./pages/footer/Footer.jsx";
import Login from "./pages/user/login/Login.jsx";
import Cart from "./pages/cart/Cart.jsx";

function App() {

  return (
    <>
        <Router>
            <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            <Footer />
        </Router>
    </>
  )
}

export default App
