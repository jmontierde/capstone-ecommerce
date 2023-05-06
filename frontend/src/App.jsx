import {Routes, Route} from 'react-router-dom'
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'

import { loadUser } from './actions/userActions'
import store from './store'
import { useEffect } from 'react'
function App() {
  
  useEffect(() => {
    store.dispatch(loadUser())
  },[])

  return (
    <>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/product" element={<Home/>} />
          <Route path="/search/:keyword" element={<Home/>} />
          <Route path="/product/:id" element={<ProductDetails/>} />
          <Route path="/login" element={<Login/>} />  
          <Route path="/register" element={<Register/>} />  

        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App;