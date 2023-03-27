import {Routes, Route} from 'react-router-dom'
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import Home from "./components/Home"
import Product from './components/Product'
function App() {

  return (
    <>
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
      </Routes>
      <Footer/>
    </div>
  </>
  )
  }

export default App
