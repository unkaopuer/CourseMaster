import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Library from '@material-ui/icons/LocalLibrary'
import Button from '@material-ui/core/Button'
import {auth} from '../../auth/api-auth'
import { Link,  useNavigate, useLocation } from 'react-router-dom'


const isActive = (location, path) => {
    if(location.pathname === path)
        return {color: '#f57c00'}
    else
        return {color: '#fffde7'}
}

const isPartActive = (location, path) =>{
    if(location.pathname.includes(path))
        return {color: '#fffde7', backgroundColor: '#f57c00', marginRight:10}
    else
    return {color: '#616161', backgroundColor: '#fffde7', border:'1px solid #f57c00', marginRight:10}
}

const Menu = () =>{
    const navigate = useNavigate()
    const location = useLocation()
    return (
    <AppBar position="fixed" style={{zIndex:12343455}}>
        <Toolbar>
            <Typography variant="h6" color="inherit">
                CourseMaster
            </Typography>
            <div>
                <Link to="/">
                    <IconButton aria-label="Home" style={isActive(location, "/")}>
                        <HomeIcon/>
                    </IconButton>
                </Link>
            </div>
            <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
            {
                !auth.isAuthenticated() && (<span>
                    <Link to="/signup">
                        <Button style={isActive(location, "/signup")}>
                        Sign up
                        </Button>
                    </Link>
                    <Link to="/signin">
                        <Button style={isActive(location, "/signin")}>
                        Sign in 
                        </Button>
                    </Link>
                </span>)               
            }
            {
                auth.isAuthenticated() &&(<span>
                    {auth.isAuthenticated().user.educator && 
                    (<Link to="/teach/courses">
                        <Button style={isPartActive(location, "/teach/")}>
                            <Library/> Teach
                        </Button>
                    </Link>)}
                    <Link to={"/user/" + auth.isAuthenticated().user._id}>
                        <Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>
                            My Profile
                        </Button>
                    </Link>
                    <Button color="inherit" onClick={() => {
                        auth.clearJWT(()=> navigate('/'))
                    }}>
                        Sign out
                    </Button>
                </span>)
            }    
                </span>
            </div>
        </Toolbar>
    </AppBar>
    )
}
export default Menu


