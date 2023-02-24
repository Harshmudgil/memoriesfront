import React from 'react'
import { Avatar, Button, Typography, Grid, Container, Paper } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyle from './style'
import Input from './Input';
import { useHistory } from 'react-router-dom';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import dotenv from 'dotenv';

import { useState, useEffect } from 'react';
import Icon from './Icon'
import { useDispatch } from 'react-redux';

import {signin,signup} from '../../action/auth';

dotenv.config();
const initalState = {firstName : '',secondName : '', email : '', password : '' , confirmPassword:'' };
const Auth = () => {
    const ClientId = process.env.REACT_APP_ClientId;
    const [showPassword, setShowPassword] = useState(false);
    const [SignUp, setSignUp] = useState(false);
    const [formData, setFormData] = useState(initalState);
    const classes = useStyle();
    const history = useHistory();
    const dispatch = useDispatch();
    const handleShowPassword = () =>  setShowPassword((prevShowPassword) => !prevShowPassword) 
    const handleSubmit = (e) => {
          e.preventDefault();
          if(SignUp){
            console.log(formData);
            dispatch(signup(formData,history))
        }else{
            dispatch(signin(formData,history))
        }
    }
    const handleChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value});
    }
    const Switch = () => {
        setSignUp((prevSignRecord) => !prevSignRecord)
        setShowPassword(false);
    }
  
    useEffect(()=>{
        gapi.load("client:auth2",()=>{
            gapi.auth2.init({
            clientId: ClientId,
            'response_type' : 'token',
            scope : 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'     
        })
        },[])
    })

    const onSuccess = async () => {
        const GoogleAuth = gapi.auth2.getAuthInstance()
        const result = GoogleAuth.currentUser.get().getBasicProfile(); 
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
            try {
            dispatch({type : 'AUTH', data : {result , token}});
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    };
    const onFailure = (response) => {
        console.log('FAILED', response);
    };
  

   
    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>{SignUp ? "Sign Up" : "Sign In"}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {SignUp && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus xs={6} />
                                <Input name="secondName" label="Last Name" handleChange={handleChange} autoFocus xs={6} />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} setShowPassword={handleShowPassword} />
                        {SignUp &&
                            <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />
                        }
                    </Grid>
                    <Button type='submit' fullWidth variant="contained" color="primary" className={classes.submit}>
                        {SignUp ? "Sign Up" : "Sign In"}
                    </Button>
                   
                    <GoogleOAuthProvider clientId= {ClientId}>
                        <GoogleLogin
                            clientId= {ClientId}
                            render={(renderProps) => (
                                <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained" >
                                    Google SignIn
                                </Button>
                            )}
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                        </GoogleOAuthProvider>
                    <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={Switch}>
                                {SignUp ? "already have a account? Sign In" : "dons't have a account? Sign Up!"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth