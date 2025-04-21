import React from 'react'
import Logo from '../logo.png'
import { Link, Navigate } from 'react-router-dom'

class Signin extends React.Component{
    constructor(props){
        super(props)
        this.state = {isSignedIn:false}
    }

    handleOnChange(e){

        this.setState({[e.target.name]:e.target.value})

    }

    async handleSubmit(e){
        e.preventDefault();

        const data = {
            email: this.state.email,
            password: this.state.password
        }

        try {
            
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if(response.ok){
                const user = await response.json()
                alert("Login Success")
                localStorage.setItem("user",JSON.stringify(user))
                this.setState({"isSignedIn":true})
               
            } else{
                this.setState({"message":"Bad Credentials"})
                this.setState({"isSignedIn":false})
            }

        } catch(error) {
            console.log('Error : ' + error)
            this.setState({"message":"Bad Credentials"})
            this.setState({"isSignedIn":false})
        }

    }

    render() {

        if(this.state.isSignedIn){
            return <Navigate to="/" replace={true} />
        }

      return (
        <>
            <div className="container d-flex justify-content-center">
                <div className="card p-4 shadow-lg" style={{maxWidth:"400px", width: "100%"}}>
                    
                    <div className="text-center mb-4 bg-dark">
                        <img src={Logo} alt="MarketMatrix Logo" className="img-fluid" style={{maxWidth: "200px", height:"auto"}} />
                    </div>
                    
                    <h2 className="text-center">Sign In</h2>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" name="email" onChange={this.handleOnChange.bind(this)} className="form-control" placeholder="Enter your email" required />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-group">
                                <input type="password" name="password" onChange={this.handleOnChange.bind(this)} className="form-control" placeholder="Enter password" required />
                                <div className="input-group-append">
                                    <button type="button" id="toggleButton" className="btn btn-outline-secondary">SHOW</button>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                        <div className="text-center mt-3">
                            <a href="/forgot-password" className="text-muted">Forgot Password?</a>
                        </div>
                    </form>

                    {
                        this.state.message?
                        <div className="mt-3">
                            <div className="alert alert-danger text-center">{this.state.message}</div>
                        </div>
                        : <></>
                    }

                    <hr/>

                    <p className="text-center mt-3">New to MarketMatrix?</p>
                    <Link to="/register" className="btn btn-success btn-block">Create Your Account</Link>
                </div>
            </div>
        </>
      )
    }
}  

export default Signin