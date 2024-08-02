import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Menu from './features/core/Menu'
import Signin from './auth/Signin'


const MainRouter =() =>{
    return(
        <div>
            <Menu />
            <Routes>
                
                <Route  path="/signin" component={<Signin/>}/>
            </Routes>
        </div>
    )
}

export default MainRouter