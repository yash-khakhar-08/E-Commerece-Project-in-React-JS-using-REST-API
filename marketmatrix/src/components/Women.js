import React from 'react'
import Products from './Products'

class Women extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){
        const {updateCartCount} = this.props.context
        return(
            <>
            <h2 className='pl-2'>Home - Women</h2>
            <Products sectionName="Women" updateCartCount={updateCartCount} />
            </>
        )
    }
}

export default Women