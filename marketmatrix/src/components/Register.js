import React from 'react'
import Logo from '../logo.png'
import { Link, Navigate } from 'react-router-dom'

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state = {gender:'male',isAccountCreated:false}
    }

    handleOnChange(e){
        this.setState({[e.target.name]:e.target.value})
    }

    async handleOnSubmit(e){
        e.preventDefault()

        const data = {
            fullName: this.state.fullName,
            email: this.state.email,
            password: this.state.password,
            gender: this.state.gender,
            mobileNo: this.state.mobileNo
        }

        try{

            const response = await fetch("http://localhost:8080/register",{
                method: 'POST',
                headers:{
                     'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if(response.ok){
                alert("Account Created Successfully!!")
                this.setState({"isAccountCreated":true})
            } else{
                this.setState({"isAccountCreated":false})
            }


        } catch(error){
            this.setState({"isAccountCreated":false})
        }


    }

    render(){

        if(this.state.isAccountCreated){
            return <Navigate to="/signin" replace={true} />
        }

        return(
            <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card p-4 shadow-lg" style={{maxWidth:"500px", width:"100%"}}>
                    
                    <div className="text-center mb-4 bg-dark">
                        <img src={Logo} alt="MarketMatrix Logo" className="img-fluid" style={{maxWidth:"200px", height:"auto"}} />
                    </div>

                    <h2 className="text-center">Sign Up</h2>
                    <form onSubmit={this.handleOnSubmit.bind(this)}>
                        
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" onChange={this.handleOnChange.bind(this)} className="form-control" placeholder="First and last name" required />
                        </div>

                        <div className="form-group">
                            <label>Gender</label><br/>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="gender" onChange={this.handleOnChange.bind(this)} value="male" id="male" defaultChecked={true} />
                                <label className="form-check-label">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="gender" onChange={this.handleOnChange.bind(this)} value="female" id="female" />
                                <label className="form-check-label">Female</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" name="mobileNo" onChange={this.handleOnChange.bind(this)} className="form-control" placeholder="10-digit mobile number" pattern="[0-9]{10}" required/>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" onChange={this.handleOnChange.bind(this)} className="form-control" placeholder="Enter your email" required/>
                        </div>

                        <div className="form-group">
                            <label>Set Password</label>
                            <div className="input-group">
                                <input type="password" name="password" onChange={this.handleOnChange.bind(this)} className="form-control" placeholder="Set new password" required/>
                                <div className="input-group-append">
                                    <button type="button" id="togglePassword1" className="btn btn-outline-secondary">SHOW</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-group">
                                <input type="password" id="password2" name="password2" className="form-control" placeholder="Confirm Password" required/>
                                <div className="input-group-append">
                                    <button type="button" id="togglePassword2" className="btn btn-outline-secondary">SHOW</button>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success btn-block">Sign Up</button>
                    </form>

                    <hr/>

                    <p className="text-center">Already have an account? <Link to="/signin">Sign in</Link></p>
                </div>
            </div>
            </>
        )
    }
}

export default Register