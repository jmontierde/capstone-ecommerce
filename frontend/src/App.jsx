import {Routes, Route} from 'react-router-dom'
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'
import Product from './components/product/Product'
function App() {
  
  return (
    <>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/product" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          {/* <Route path="/product/:id" element={<Product />} /> */}

          <Route path="/search/:keyword" element={<Home />} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App;