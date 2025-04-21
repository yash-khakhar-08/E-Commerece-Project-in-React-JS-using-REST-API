import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Search(props){

    const location = useLocation()
    const { products = [], searchValue='' } = location.state || {};
    const user = JSON.parse(localStorage.getItem("user"))

    const [qty, setQty] = useState(1)

    const addToCart = async (e) => {

        if(user && localStorage.getItem("user")){

            const {updateCartCount} = props.context

            const data = {
                productId: Number(e.target.value),
                purchaseQty: Number(qty),
                userId: user.id
            }

            console.log(data)

            const response = await fetch("http://localhost:8080/user/addToCart",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.jwtToken}`
                },
                body: JSON.stringify(data)
            })

            if(response.ok){
                alert("Added to cart")
                updateCartCount()
            } else{
                console.log("server error")
            }

        } else{
            alert("Login to add to cart")
        }

    }

    return(
        products.length > 0?
        <div className='container-fluid mt-2 p-4'>
            <h2>"{products.length}" results found for "{searchValue}"</h2>
            <div className="row align-items-start">
            {
                products.map(
                    (value, index) => {
                        return( 
                            <div key={index} className="col-md-3 col-sm-6 col-6 px-1 mb-3">
                                <div className="product-card"> 

                                    <Link key={value.id} to="/productInfo" state={{product:value.productResponse[0],categoryId:value.id,inCart:value.productResponse[0].inCart,user:user}}>
                                        <img src={`http://localhost:8080/products/${value.productResponse[0].productImage}`} alt="product" className="product-img" />
                                    </Link> 
                                        
                                    <div className="product-info">
                                        <h5>{value.productResponse[0].productName}</h5>
                                        <p className="text-muted">Price: <strong>{value.productResponse[0].productPrice}</strong> rs.</p>
                                        <button className="btn btn-primary w-100" type="button" 
                                            data-toggle="collapse" 
                                            data-target={`#product_${value.id}`}
                                            aria-controls={`product_${value.id}`}
                                            aria-expanded="false">
                                            More Info
                                        </button>
                                        <div className="collapse mt-2" id={`product_${value.id}`}>
                                                <p ><strong>Stock:</strong>{value.productResponse[0].productQty} left</p>
                                                <p><strong>Select Quantiy: </strong> 
                                                    <input type="number" name="qty" value={qty} min="1" max="3" onChange={(e) => setQty(e.target.value)} />
                                                </p>
                                                {
                                                    value.productResponse[0].inCart?
                                                    <Link to="/cart" className="btn btn-primary w-100 add-to-cart" >
                                                        Go to cart
                                                    </Link> 
                                                    :
                                                    <button className="btn btn-primary w-100 add-to-cart" value={value.productResponse[0].id} onClick={addToCart.bind(this)} >
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
            }
             </div>
        </div>
        : 
        <h3>Loading Products...</h3>
    )
}