import React from 'react'
import NavbarWrapper from '../Wrappers/NavbarWrapper'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

class Layout extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: props.user,
            cartCount: null
        }
    }

    updateCartCount = async () => {

        try{
    
          if(this.state.user != null) {
    
            const response = await fetch("http://localhost:8080/user/getCartCount",{
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
              const data = await response.text()
              if(data.trim().length > 0)
                this.setState({"cartCount":data})
              else
                this.setState({"cartCount":0})
      
            } else if(response.status === 400){
              console.log("Internal Server error can be because of jwt token expired")
              this.setState({"user":null})
              // jwt token expired
              localStorage.removeItem("user")
              this.setState({"cartCount":0})
            }else{
              console.log("Internal Server error can be because of jwt token or no product added to cart")
              this.setState({"cartCount":0})
            }
    
          }
    
        } catch(error){
          console.log("Error for user null while retriving cart count from Layout")
          console.log(error)
          localStorage.removeItem("user")
          this.setState({"user":null})
          this.setState({"cartCount":0})
        }
            
      }

      updateUserState = () =>{
        this.setState({"user":JSON.parse(localStorage.getItem("user"))})
      }

      componentDidMount(){
        this.updateCartCount()
      }

    render() {
      return (
        <>
            <NavbarWrapper user={this.state.user !== null? this.state.user :null} cartCount={this.state.cartCount != null ? this.state.cartCount : 0} />

            <main>
                <Outlet 
                  context=
                    {{
                      updateCartCount: this.updateCartCount,
                      updateUserState:this.updateUserState,
                      user: this.state.user !== null? this.state.user : null
                    }} 
                  />
            </main>

            <Footer/>

        </>
      )
    }
}

export default Layout