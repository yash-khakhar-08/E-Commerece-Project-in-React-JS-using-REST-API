import React from 'react'
import { Link } from 'react-router-dom'
class Footer extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
    }

    render(){
        return(

            <footer className="bg-dark text-light pt-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <h5>About Us</h5>
                        <p className="small">We are committed to providing the best products with quality service.</p>
                    </div>

                    <div className="col-md-3">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-light">Home</Link></li>
                            <li><Link to="/orders" className="text-light">Orders</Link></li>
                            <li><Link to="" className="text-light">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h5>Customer Support</h5>
                        <ul className="list-unstyled">
                            <li><Link to="" className="text-light">FAQs</Link></li>
                            <li><Link to="" className="text-light">Return Policy</Link></li>
                            <li><Link to="" className="text-light">Shipping Info</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h5>Contact Us</h5>
                        <p className="small">
                            📍 123 Main Street, Rajkot, India <br/>
                            📞 +123 456 7890 <br/>
                            ✉️ support@example.com
                        </p>
                        <div>
                            <Link to="" className="text-light mr-2"><i className="bi bi-facebook"></i></Link>
                            <Link to="" className="text-light mr-2"><i className="bi bi-twitter"></i></Link>
                            <Link to="" className="text-light mr-2"><i className="bi bi-instagram"></i></Link>
                        </div>
                    </div>
                </div>

                <hr className="bg-light"/>
                <div className="text-center pb-3">
                    <p className="small mb-0">&copy; 2025 MarketMatrix. All Rights Reserved.</p>
                </div>
            </div>
        </footer>

        )
    }
}

export default Footer