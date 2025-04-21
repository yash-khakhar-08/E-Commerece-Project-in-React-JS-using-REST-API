import React from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import '../cart.css'

class Cart extends React.Component{
    constructor(props){
        super(props)
        this.state = {"cartItems":[]}
    }

    async componentDidMount(){

        const {user} = this.props.context
        this.setState({"user":user})

        try{

            if(user !== null) {

                const response = await fetch("http://localhost:8080/user/getAllCartItems",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.jwtToken}`
                    },
                    body: JSON.stringify({
                        id: user.id
                    })
                })
        
                if(response.ok){
                    const data = await response.json()
                    this.setState({"cartItems":data})
                } else{
                    console.log("server error")
                }

            }
    
        } catch(error){
            console.log(error)
        }
  
    }

    increaseQuantity = async (cartId) => {
    
        let updatedCartItems = this.state.cartItems.map(cart => {
            if (cart.id === cartId) {
              if (cart.purchaseQty < 3) {
                const newQty = cart.purchaseQty + 1
                return {
                  ...cart,
                  purchaseQty: newQty,
                  purchaseAmt: cart.product.productPrice * newQty
                };
              }
            }
            return cart; // return other items unchanged
          });

          const response = await fetch("http://localhost:8080/user/updateCart",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.user.jwtToken}`
                },
                body: JSON.stringify(
                    updatedCartItems.find(cart => cart.id === cartId)
                )
            })

            if(response.ok){
                this.setState({ cartItems: updatedCartItems });
            }
          
    }
  
    decreaseQuantity = async (cartId) => {
        let updatedCartItems = this.state.cartItems.map(cart => {
            if (cart.id === cartId) {
              if (cart.purchaseQty > 1) {
                const newQty = cart.purchaseQty - 1
                return {
                  ...cart,
                  purchaseQty: newQty,
                  purchaseAmt: cart.product.productPrice * newQty
                };
              }
            }
            return cart; // return other items unchanged
          });
          
          const response = await fetch("http://localhost:8080/user/updateCart",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.user.jwtToken}`
            },
            body: JSON.stringify(
                updatedCartItems.find(cart => cart.id === cartId)
            )
        })

        if(response.ok){
            this.setState({ cartItems: updatedCartItems });
        }
        
    }

    removeItem = (cartId) => {

        const {updateCartCount} = this.props.context

        Swal.fire({
            title: "Are you sure? ",
            text: "You want to remove the product from cart?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                let updatedCartItems = this.state.cartItems.filter(cart => cart.id !== cartId)

                const response = await fetch("http://localhost:8080/user/deleteFromCart",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.state.user.jwtToken}`
                    },
                    body: JSON.stringify({
                        cartId: cartId
                    })
                })

                if(response.ok){
                    this.setState({ cartItems: updatedCartItems })
                    updateCartCount()
                    Swal.fire("Deleted!", "Item has been removed.", "success")
                }
                
            }
        });
        
    }
  

    render() {
      return (
        <>
            {this.state.cartItems && this.state.cartItems.length > 0 ?

                <div className="container mt-2 mb-2 shpcart-container">
                <h2 className="text-center mb-4">🛒 Shopping Cart</h2>

                <div id="cartItems">

                    {
                        this.state.cartItems.map(
                            (value, index) => {
                                return(

                                    <div key={value.productId} className="cart-item d-flex align-items-center">
                                        <Link to="/productInfo" state={{product:value.product,categoryId:value.categoryId,inCart:true,user:this.state.user}}>
                                            <img src={`http://localhost:8080/products/${value.product.productImage}`} alt="Product"/>
                                        </Link>
                                        <div className="details">
                                            <h5>{value.product.productName}</h5>
                                            <p className="price">Product Price: <span>{value.product.productPrice}</span> rs</p>
                                            <div className="quantity-controls">
                                                <button className="btn btn-sm btn-light edit-cart" onClick={this.decreaseQuantity.bind(this, value.id)} >−</button>
                                                <input type="text" className="form-control mx-1" value={value.purchaseQty} readOnly/>
                                                <button className="btn btn-sm btn-light edit-cart" onClick={this.increaseQuantity.bind(this,value.id)} >+</button>
                                            </div>
                                            <p className="price">Subtotal: <span>{value.purchaseAmt} </span> rs</p>

                                            <span className="remove-btn mt-2 d-block" onClick={this.removeItem.bind(this, value.id)}>Remove</span>

                                        </div>
                                    </div>

                                )
                            }
                        )
                    }


                </div>

                <div className="cart-summary p-3 bg-white mt-3 shadow-sm d-flex justify-content-between align-items-center">
                    <h4>Total: <span className="text-danger grand-total">{this.state.cartItems.reduce((sum, item) => sum + item.purchaseAmt, 0)} rs</span></h4>
                    
                    <Link className="btn btn-warning px-4 py-2" to={`/checkout/${this.state.cartItems.reduce((sum, item) => sum + item.purchaseAmt, 0)}`}>
                        Proceed to Checkout
                    </Link>
                    
                </div>
                </div>

                : 
                <div className="container mt-5">
                        <h2 className="text-center mb-4">🛒 Shopping Cart</h2>
                        <h2 className="text-center mb-4">No Cart Items | Go to Home</h2>
                </div>
                      
            }

            {this.state.cartItems && this.state.cartItems.length === 0 ?
                <><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></> : <br/>
            }

            {this.state.cartItems && this.state.cartItems.length === 1 ?
                <><br/><br/></> : <br/>
            }
            
        
        </>
      )
    }
}

export default Cart