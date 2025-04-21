import React from 'react'
import { useOutletContext } from 'react-router-dom'

const CommonWrapper = (WrappedComponent) => {
    return function WrapperWithContext(props){
        const context = useOutletContext()
        return <WrappedComponent {...props} context={context} />
    }
}

export default CommonWrapper