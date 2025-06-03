import './App.css'
import Popup from './popup/Popup'
import PublishOptions from './components/publishOptions/PublishOptions'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from './components/productList/ProductList';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Popup />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/published" element={<PublishOptions />} />
      </Routes>
    </Router>
  )
}

export default App
