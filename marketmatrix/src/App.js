import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Men from './components/Men'
import AddProduct from "./components/AddProduct";
import Women from "./components/Women";
import ProductInfo from "./components/ProductInfo";
import Register from "./components/Register";
import CheckoutWrapper from "./Wrappers/CheckoutWrapper";
import Orders from "./components/Orders";
import Layout from "./components/Layout";
import CommonWrapper from "./Wrappers/CommonWrapper";
import Cart from "./components/Cart";
import Home from "./components/Home";
import Search from "./components/Search";
import Signin from "./components/Signin";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: JSON.parse(localStorage.getItem("user"))
    }
  }

  async componentDidMount(){

    try{
      
      const response = await fetch("http://localhost:8080/getCategories")
      if(response.ok){
        const category = await response.json()
        localStorage.setItem("category",JSON.stringify(category))
      }

    }catch(error){
      console.log(error)
    }
    
  }

  render() {
    const MenWrapper = CommonWrapper(Men)
    const WomenWrapper = CommonWrapper(Women)
    const CartWrapper = CommonWrapper(Cart)
    const HomeWrapper = CommonWrapper(Home)
    const SearchWrapper = CommonWrapper(Search)
    const SigninWrapper = CommonWrapper(Signin)
    const ProductInfoWrapper = CommonWrapper(ProductInfo)
    return (
      <>
      <Router>
        <Routes>
          <Route path='/' element={<Layout user={this.state.user} />}>
            <Route index element={<HomeWrapper />} />
            <Route path='signin' element={<SigninWrapper />}></Route>
            <Route path='register' element={<Register/>}></Route>
            <Route path='men' element={<MenWrapper  />}></Route>
            <Route path='women' element={<WomenWrapper  />}></Route>
            <Route path='search' element={<SearchWrapper  />}></Route>
            <Route path='productInfo' element={<ProductInfoWrapper />}></Route>
            <Route path='cart' element={<CartWrapper user={this.state.user}  />}></Route>
            <Route path='checkout/:totalAmt' element={<CheckoutWrapper user={this.state.user}  />}></Route>
            <Route path='orders' element={<Orders user={this.state.user} />}></Route>
            <Route path='addProduct' element={<AddProduct />}></Route>
          </Route>
        </Routes>
      </Router>
      </>
    )
  }
}

export default App
