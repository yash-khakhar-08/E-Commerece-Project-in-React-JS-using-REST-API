import React from 'react'
import Slider from './Slider'
import Products from './Products'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    componentDidMount(){
      // calling needed after signin to update in navbar
      const { updateCartCount, updateUserState } = this.props.context
      updateCartCount()
      updateUserState()
    }

    render() {
      const { updateCartCount } = this.props.context
      return (
        <>
            <Slider/>
            <Products updateCartCount={updateCartCount} />
        </>
      )
    }
}

export default Home