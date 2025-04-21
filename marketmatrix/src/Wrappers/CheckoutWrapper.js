// CheckoutWrapper.js
import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import Checkout from '../components/Checkout'

const CheckoutWrapper = (props) => {
    const { totalAmt } = useParams()
    const context = useOutletContext()
    return <Checkout totalAmt={totalAmt} context={context} />
}

export default CheckoutWrapper
