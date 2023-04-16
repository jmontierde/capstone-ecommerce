import {Routes, Route} from 'react-router-dom'
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'

function App() {
  
  return (
    <>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/product/:id" element={<ProductDetails/>} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App;