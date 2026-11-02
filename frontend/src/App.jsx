import Navbar from './components/navbar/navbar';
import Shop from './pages/shop';
import ShopCategory from './pages/shopcategory';
import Product from './pages/product';
import Cart from './pages/cart';
import LoginSignup from './pages/loginsignup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/footer/footer';
import men_banner from './components/assets/banner_mens.png';
import women_banner from './components/assets/banner_women.png';
import kids_banner from './components/assets/banner_kids.png';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/men' element={<ShopCategory banner = {men_banner} category='men' />} />
          <Route path='/women' element={<ShopCategory banner = {women_banner} category='women' />} />
          <Route path='/kids' element={<ShopCategory banner = {kids_banner} category='kids' />} />
          <Route path='/product' element={<Product />}>
              <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
