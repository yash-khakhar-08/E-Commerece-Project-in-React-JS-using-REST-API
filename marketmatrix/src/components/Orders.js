import React from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

class Orders extends React.Component{

    constructor(props){
        super(props)
        this.state = {"user":props.user,"orderItems": []}
    }

    async componentDidMount(){

        try{

            if(this.state.user != null) {

                const response = await fetch("http://localhost:8080/user/getAllOrders",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.state.user.jwtToken}`
                    },
                    body: JSON.stringify({
                        userId: this.state.user.id
                    })
                })
        
                if(response.ok){
                    const data = await response.json()
                    this.setState({"orderItems":data})
                } else{
                    alert("Something went wrong...")
                }

            }
    
        } catch(error){
            alert("Something went wrong...")
        }

    }

    cancelOrder(orderId){
        Swal.fire({
                    title: "Are you sure? ",
                    text: "You want to cancel order?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, cancel it!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        
                        let updatedOrders = this.state.orderItems.map(order => {
                            if (order.id === orderId) {
                              return {
                                ...order,
                                status: "Canceled" 
                              };
                            }
                            return order;
                          });

                        const response = await fetch("http://localhost:8080/user/canelOrder",{
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.state.user.jwtToken}`
                            },
                            body: JSON.stringify({
                                orderId: orderId
                            })
                        })
        
                        if(response.ok){
                            this.setState({ orderItems: updatedOrders })
                            Swal.fire("Canceled!", "order has been canceled...", "success")
                        } else{
                            Swal.fire("Error", "Something went wrong on server", "error")
                        }
                        
                    }
                });
    }

    options = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    render(){
        return(
            <>
                {this.state.orderItems != null && this.state.orderItems.length > 0 ? 
                <div className="container mt-5 order-container">
                    <h2 className="text-center mb-4">🛒 Order History</h2>

                    {this.state.orderItems.map(
                        (value, index) => {
                            return(
                                <div key={index} id="cartItems">

                                    <div className="cart-item d-flex align-items-center">
                                        <Link to="">
                                            <img src={`http://localhost:8080/products/${value.product.productImage}`} alt="Product" />
                                        </Link>
                                        <div className="details">
                                            <h5>{value.product.productName}</h5>
                                            <p className="price">Subtotal: {value.purchaseAmt}</p>
                                            <div className="order-info mt-2">
                                                <p className="mb-1"><strong>Date of Order:</strong> <span>{new Date(value.date).toLocaleString("en-IN", this.options)}</span></p>
                                                <p className="mb-1"><strong>Quantity:</strong> <span>{value.purchaseQty}</span></p>
                                                <p className="mb-1"><strong>Payment Mode:</strong> <span>{value.paymentMode}</span></p>
                                                <p className="mb-1"><strong>Status:</strong> <span className="text-success">{value.status}</span></p>
                                            </div>
                                            {value.status === 'Pending' ? 
                                                <button className="btn btn-danger btn-sm mt-3 cancel-order" onClick={this.cancelOrder.bind(this, value.id)}>Cancel Order</button>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                    
                </div>
                :    
                <div className="container mt-5" >
                        <h2 className="text-center mb-4">🛒 Order History</h2>
                        <h2 className="text-center mb-4">No Orders | Go to <Link to="/">Home</Link></h2>
                </div>
                } 

            </>
        )
    }

}

export default Orders