import React from 'react'
import Products from './Products'

class Men extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){
        const {updateCartCount} = this.props.context
        return(
            <>
            <h2 className='pl-2'>Home - Men</h2>
            <Products sectionName= "Men" updateCartCount={updateCartCount} />
            </>
        )
    }
}

export default Men