import React from 'react'
import ProductItem from './ProductItem';

class Products extends React.Component{
    constructor(props){
        super(props)
        this.state = {"products":[],"sectionName":props.sectionName}
    }

    async componentDidMount(){

        try{

            const response = await fetch("http://localhost:8080/getProducts",{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    sectionName: this.state.sectionName
                })
            })
            if(response.ok){
                const data = await response.json()
                this.setState({"products":data})
                this.props.updateCartCount()
            } else{
                this.setState({"isProductAvailable":"No Products available for this section at a moment"})
            }

        }catch(error){
            console.log(error)
            this.setState({"isProductAvailable":"Loading Products..."})
        }

    }

    render(){
        return(
            <>{
            this.state.products.length > 0 ? 
            this.state.products.filter(product => product.productResponse.length > 0)
                .map(
                    (value,index) => {
                        return(
                            <div key={index} className='container-fluid mt-2 p-4'>
                                <h2 id={value.id}>Category: {value.catName} - {value.sectionName}</h2>
                                <div className='row align-items-start'>
                                    {
                                        <ProductItem updateCartCount={this.props.updateCartCount}
                                            products = {value.productResponse} categoryId={value.id}
                                         />
                                    }
                                    
                                </div>
                            </div>
                        )
                    }
                )
                : <h4 className='pl-2'>
                    {this.state.isProductAvailable}
                </h4>
                }

            </>
            
        )
    }
}

export default Products