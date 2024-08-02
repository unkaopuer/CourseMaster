import { auth } from './api-auth'
import React,{ Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render = { props=>(
        auth.isAuthenticated()?(
            <Component {...props} />
        ) :(
            <Redirect to ={{
                pathname:'/signin',
                state:{ from:props.location }
            }} />
        )
    )} />
)

export default PrivateRoute