import React from 'react'
import { Typography , AppBar, Toolbar, Avatar, Button} from '@material-ui/core'
import {Link , useHistory , useLocation} from 'react-router-dom';
import useStyles from './style'
import memoriesLogo from '../images/memories-Logo.png';
import memoriesText from '../images/memories-Text.png';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import { useState , useEffect } from 'react';


const Navbar = () => {
    const [user , setuser] = useState(JSON.parse(localStorage.getItem('profile')));
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const logOut = ()=>{
    dispatch({type : 'LOGOUT'})
    history.push('/');
    setuser(null);
    }
    useEffect(() => {
        const token = user?.token;
        if(token){
            const decodeToken = decode(token);
            if(decodeToken.exp*1000 < new Date().getTime()) logOut();
        }
    })
    useEffect(()=>{
    setuser(JSON.parse(localStorage.getItem('profile')));
    },[location])

    const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
        <Link to="/" className={classes.brandContainer}>
        <img  src={memoriesText} alt="icon" height="45" />
        <img className={classes.image} src={memoriesLogo} alt="icon" height='40px' />
        </Link>
        <Toolbar className={classes.toolbar}>
            {user ? (
                <div className={classes.profile}>
                <Avatar className={classes.purple} src={user.result.hK} alt='icon'>{user.result.rV.charAt(0)}</Avatar>
                <Typography>{user?.result?.rV}</Typography>
                <Button varient='contained' className={classes.logout} color='secondary' onClick={logOut}>Log Out</Button>
                </div>
            ):(
                <Button component={Link} to="/auth" variant='contained' color='primary'>Sign in</Button>
            )}
        </Toolbar>
      
      </AppBar>
  )
}

export default Navbar