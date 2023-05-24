import { Routes, Route, Navigate} from 'react-router-dom'
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import axios from 'axios'
import { loadUser } from './actions/userActions'
import store from './store'
import { useEffect } from 'react'
import ProtectedRoute from './components/route/ProtectedRoute'


import { useDispatch } from 'react-redux'
function App() {
  // const dispatch = useDispatch()
  
  useEffect(() => {
    store.dispatch(loadUser())

  }, [])



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


            <Route exact path='/me' element={<ProtectedRoute component={Profile}/>} />
            <Route exact path='/me/update' element={<ProtectedRoute component={UpdateProfile}  />} /> 
          </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App;