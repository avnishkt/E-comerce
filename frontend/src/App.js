import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    try {
      const dataResponse = await axios({
        url: SummaryApi.current_user.url,
        method: SummaryApi.current_user.method,
        withCredentials: true // Include credentials (cookies, authorization headers, etc.)
      });

      const dataApi = dataResponse.data;

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const dataResponse = await axios({
        url: SummaryApi.addToCartProductCount.url,
        method: SummaryApi.addToCartProductCount.method,
        withCredentials: true // Include credentials (cookies, authorization headers, etc.)
      });

      const dataApi = dataResponse.data;

      setCartProductCount(dataApi?.data?.count);
    } catch (error) {
      console.error('Error fetching add to cart count:', error);
    }
  };

  useEffect(() => {
    // Fetch user details
    fetchUserDetails();

    // Fetch user cart product count
    fetchUserAddToCart();
  }, []);

  return (
    <>
      <Context.Provider value={{
        fetchUserDetails, // user detail fetch 
        cartProductCount, // current user add to cart product count,
        fetchUserAddToCart
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        <Header/>
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet/>
        </main>
        <Footer/>
      </Context.Provider>
    </>
  );
}

export default App;
