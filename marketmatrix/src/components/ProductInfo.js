import React, { useEffect, useState } from 'react'
import { useLocation, Link} from 'react-router-dom'
import ProductItem from './ProductItem'

function ProductInfo(props){

    const product = useLocation().state.product
    const categoryId = useLocation().state.categoryId
    const user = useLocation().state?.user || null
    const cart = useLocation().state.inCart

    const [relatedProducts, setRelatedProducts] = useState(null)
    const[qty, setQty] = useState(1)
    const[inCart, setInCart] = useState(useLocation().state.inCart)

    const increaseQuantity = () => {

      if(qty<3){
        setQty(qty+1)
      }

    }

    const decreaseQuantity = () => {

        if(qty>1){
            setQty(qty-1)
          }

    }

    const addToCart = async () => {
        
        try{
            if(user != null){

                const data = {
                    productId: product.id,
                    purchaseQty: qty,
                    userId: user.id
                }

                const response = await fetch("http://localhost:8080/user/addToCart",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.jwtToken}`
                    },
                    body: JSON.stringify(data)
                })
    
                if(response.ok){
                    setInCart(true)
                    props.context.updateCartCount()
                    alert("Added to cart")
                } else{
                    console.log("server error")
                }

            } else{
                alert("login to add to cart")
            }

        } catch(error){
            console.log(error)
        }

    }

    useEffect(
        () => {

            const fetchData = async () => {

                setRelatedProducts(null)
                try{
                    const response = await fetch("http://localhost:8080/getRelatedProducts",{
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json',
                          },
                        body: JSON.stringify({
                            id: categoryId,
                            productId: product.id
                        })
                    })
                    if(response.ok){
                        const data = await response.json()
                        setRelatedProducts(data)
                        
                    } else{
                        console.log("data not fetched")
                    }
        
                }catch(error){
                    console.log(error)
                    
                }

            }

            fetchData();
            setInCart(cart)
            setQty(1)

        }, [product.id, categoryId, cart]
    )

    const customStyle = {
        height:"500px",
        objectFit: "cover",
        width: "100%"
    }

    return(
        <>
        
            <div className="container-fluid mt-4 pl-4 pt-2 pr-4 pb-2">
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-12">
                        <div className="product-card">
                            <img src={`http://localhost:8080/products/${product.productImage}`} alt="product" style={customStyle} />
                        </div>
                    </div>
            
                    <div className="col-md-8 col-sm-6 col-12 d-flex flex-column justify-content-center">
                        <h3 className="text-primary font-weight-bold">{product.productName}</h3>
                        <p className="text-muted"><strong>Price:</strong> {product.productPrice} rs</p>
                        <p className="text-secondary"><strong>Description:</strong> {product.productDesc}</p>
                        <p className="text-secondary"><strong>Stock:</strong> {product.productQty } left</p>

                        <div className="d-flex align-items-center mt-3">
                            <label className="font-weight-bold">Select Quantity:</label>
                            
                            <div className="d-flex align-items-center mx-2">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={decreaseQuantity}>−</button>
                                    <input type="text" className="form-control text-center mx-2 w-25" value={qty} id="quantity" readOnly/>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={increaseQuantity}>+</button>
                            </div>
                        </div>

                        { 
                        inCart === true? 
                        <Link to="/cart" className="btn btn-success mt-3 px-4 py-2 add-to-cart"  >Go to Cart</Link>
                        :
                        <button className="btn btn-success mt-3 px-4 py-2 add-to-cart" onClick={addToCart}>Add to Cart</button>
                        }                          
                    </div>
                </div>
            </div>

            {
                relatedProducts?.productResponse ?  
                <div className="container-fluid mt-4 pl-4 pt-2 pr-4 pb-2">
                    <h2 className="mb-4 recommended-label">Related Products in this Category</h2>
                    <div className="row align-items-start">
                        <ProductItem products = {relatedProducts.productResponse} categoryId={relatedProducts.id} updateCartCount={props.context.updateCartCount} />
                    </div>
                </div> 
                : <></>
            }
        
        </>
        
    )
}

export default ProductInfo