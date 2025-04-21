import React from 'react'

class Checkout extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: null,
            fullAddress:null,
            totalAmt: props.totalAmt,
            blockNo: '',
            apartmentName: '',
            pinCode: '',
            city: '',
            state: '',
            country: '',
            paymentMode: 'COD',
            orderBtnText: 'Place Order',
        }
    }

    componentDidMount(){
        const {user} = this.props.context
        this.setState({"user":user,"fullAddress":user.address})
    }

    handleOnChange(e){
        this.setState({[e.target.name]:e.target.value})
    }

    handlePaymentModeChange(e){

        this.setState({"paymentMode": e.target.value})
        this.togglePayment(e.target.value)

    }

    togglePayment(selectedPayment) {

        if (selectedPayment === "COD") {
            this.setState({"orderBtnText": "Place Order"})
        } else {
            this.setState({"orderBtnText": "Make Payment"})
        }
    }

    async saveAddress() {
        // Get address field values
        let blockNo = this.state.blockNo
        let apartmentName = this.state.apartmentName
        let pinCode = this.state.pinCode
        let city = this.state.city
        let state = this.state.state
        let country = this.state.country
        
        if (!blockNo || !apartmentName || !pinCode || !city || !state || !country) {
            alert("All address fields are required!");
            return; 
        }

        let fullAddress = `${blockNo}, ${apartmentName}, ${city}, ${state}, ${pinCode}, ${country}`

        let data = {
            userId: this.state.user.id,
            blockNo: blockNo,
            apartmentName: apartmentName,
            city: city,
            state: state, 
            pinCode: pinCode,
            country: country

        }

        try{

            let response = await fetch("http://localhost:8080/user/saveAddress",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.user.jwtToken}`
                },
                body: JSON.stringify(data)
            })

            if(response.ok){

                this.setState({fullAddress: fullAddress})

                // Close modal
                window.$('#editAddressModal').modal('hide');

            } else{
                console.log("Something went wrong...")
            }

        }catch(error){
            console.log(error)
        }
        
    }

    handlePayment(){

        if(this.state.paymentMode === "COD"){
            // this is used for COD payment
            this.placeOrder()

        } else{
            window.$('#paymentModal').modal('show');
        }

    }

    makePayment(){

        // this is used for Card payment

        this.placeOrder()
    }

    async placeOrder(){

        try{
            const {updateCartCount} = this.props.context

            let response = await fetch("http://localhost:8080/user/placeOrder",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.user.jwtToken}`
                },
                body: JSON.stringify({
                    userId: String(this.state.user.id),
                    paymentMode: this.state.paymentMode
                })
            })

            if(response.ok){

                updateCartCount()
                alert("Order Placed")
                window.history.back()
                window.$('#paymentModal').modal('hide');

            } else{
                alert("No items to be placed...")
            }

        }catch(error){
            console.log(error)
        }

    }

    render(){
        
        return(
            <>
            <div className="container mt-5">
                <h2 className="text-center mb-4">🛒 Checkout</h2>
                
                <div className="card p-4 shadow-sm">
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" id="name" placeholder="Enter your name" value={this.state.user?.fullName} readOnly />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="address">Shipping Address</label>
                            <textarea className="form-control" id="address" rows="2" placeholder="Enter your address" value={this.state.fullAddress? this.state.fullAddress: '' } readOnly></textarea>
                            <button type="button" className="btn btn-sm btn-secondary mt-2" data-bs-toggle="modal" data-bs-target="#editAddressModal">
                                Edit Address
                            </button>
                        </div>

                        <h4 className="text-primary text-center">Grand Total: <span className="text-dark">{this.state.totalAmt} rs.</span></h4>

                        <h5 className="mt-4">Payment Options</h5>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="payment" id="COD" value="COD" onChange={this.handlePaymentModeChange.bind(this)} defaultChecked />
                            <label className="form-check-label">Cash on Delivery (COD)</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="payment" id="card" value="Card" onChange={this.handlePaymentModeChange.bind(this)} />
                            <label className="form-check-label">Debit/Credit Card</label>
                        </div>

                        <button type="button" id="orderBtn" className="btn btn-success btn-block mt-4" onClick={this.handlePayment.bind(this)}>{this.state.orderBtnText}</button>
                    </form>
                </div>
            </div>

            <div className="modal fade" id="editAddressModal" tabIndex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editAddressModalLabel">Edit Address</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="addressForm">
                                <div className="form-group">
                                    <label htmlFor="block_no">Block No</label>
                                    <input type="text" className="form-control" name="blockNo" onChange={this.handleOnChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apartment_name">Apartment Name</label>
                                    <input type="text" className="form-control" name="apartmentName" onChange={this.handleOnChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pin_code">Pin Code</label>
                                    <input type="number" className="form-control" name="pinCode" onChange={this.handleOnChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input type="text" className="form-control" name="city" onChange={this.handleOnChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input type="text" className="form-control" name="state" onChange={this.handleOnChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <input type="text" className="form-control" name="country" onChange={this.handleOnChange.bind(this)} required />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.saveAddress.bind(this)}>Save Address</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="paymentModal" tabIndex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="paymentModalLabel">Enter Payment Details</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="paymentForm">
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input type="text" className="form-control" id="cardNumber" minLength="16" maxLength="16" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cardHolder">Card Holder Name</label>
                                    <input type="text" className="form-control" id="cardHolder" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input type="month" className="form-control" id="expiryDate" max="2050-12" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input type="password" className="form-control" id="cvv" minLength="3" maxLength="3" required />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.makePayment.bind(this)}>Submit Payment</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default Checkout