import React from 'react'
import {Link, Navigate} from 'react-router-dom'

class ProductItem extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            "products":props.products,
            "categoryId":props.categoryId,
            "user":JSON.parse(localStorage.getItem("user")),
            "qty":1,
            "redirectToLogin":false,
            "productIds": []
        }
    }

    async componentDidMount(){

        try{

            const response = await fetch("http://localhost:8080/user/getProductIds",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.user.jwtToken}`
                },
                body: JSON.stringify({
                    id: this.state.user.id
                })
            })
    
            if(response.ok){
                const data = await response.json()
                this.setState({"productIds":data})
            } else if(response.status === 400){
                localStorage.removeItem("user")
            }
    

        } catch(error){
            localStorage.removeItem("user")
        }

    }

    async addToCart(e){

        if(this.state.user && localStorage.getItem("user")){
            this.setState({"redirectToLogin":false})

            const data = {
                productId: e.target.value,
                purchaseQty: this.state.qty,
                userId: this.state.user.id
            }

            const response = await fetch("http://localhost:8080/user/addToCart",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.user.jwtToken}`
                },
                body: JSON.stringify(data)
            })

            if(response.ok){
                this.setState({"productIds":[...this.state.productIds,Number(e.target.value)]})
                alert("Added to cart")
                this.props.updateCartCount()
            } else{
                console.log("server error")
            }

        } else{
            alert("Login to add to cart")
            this.setState({"redirectToLogin":true})
        }

    }

    handleOnChange(e){

        this.setState({[e.target.name]:e.target.value})

    }

    render(){

        if(this.state.redirectToLogin){
            return <Navigate to="/signin" replace={true} />
        }

        return(
            <>
            {
                this.state.products.length > 0? 

                this.state.products.map(
                    (value, index) => {
                        return(
                            <div key={index} className="col-md-3 col-sm-6 col-6 px-1 mb-3">
                                <div className="product-card">
                                    {
                                         this.state.productIds.length>0?
                                         <Link key={value.id} to="/productInfo" state={{product:value,categoryId:this.state.categoryId,inCart:this.state.productIds.includes(value.id),user:this.state.user}}>
                                            <img src={`http://localhost:8080/products/${value.productImage}`} alt="product" className="product-img" />
                                         </Link> 
                                         : 
                                         <Link key={value.id} to="/productInfo" state={{product:value,categoryId:this.state.categoryId,inCart:false,user:this.state.user}}>
                                            <img src={`http://localhost:8080/products/${value.productImage}`} alt="product" className="product-img" />
                                         </Link>
                                        
                                    }
                               
                                    <div className="product-info">
                                        <h5>{value.productName}</h5>
                                        <p className="text-muted">Price: <strong>{value.productPrice}</strong> rs.</p>
                                        <button className="btn btn-primary w-100" type="button" 
                                            data-toggle="collapse" 
                                            data-target={`#product_${value.id}`}
                                            aria-controls={`product_${value.id}`}
                                            aria-expanded="false">
                                            More Info
                                        </button>
                                        <div className="collapse mt-2" id={`product_${value.id}`}>
                                                <p ><strong>Stock:</strong>{value.productQty} left</p>
                                                <p><strong>Select Quantiy: </strong> 
                                                    <input type="number" name="qty" defaultValue={1} min="1" max="3" onChange={this.handleOnChange.bind(this)} />
                                                </p>
                                                {
                                                    this.state.productIds.length>0?
                                                        this.state.productIds.includes(value.id)?
                                                        <Link to="/cart" className="btn btn-primary w-100 add-to-cart" >
                                                        Go to cart
                                                        </Link> 
                                                        : <button className="btn btn-primary w-100 add-to-cart" value={value.id} onClick={this.addToCart.bind(this)} >
                                                        Add to Cart
                                                        </button>
                                                        : <button className="btn btn-primary w-100 add-to-cart" value={value.id} onClick={this.addToCart.bind(this)} >
                                                        Add to Cart
                                                        </button>
                                                }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                )


                 : <p>Loading Products</p>
            }
            
            </>
        )
    }
}

export default ProductItem