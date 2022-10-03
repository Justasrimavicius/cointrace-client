import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from '../Firebase-config';
import setAvatarInFB from './setAvatarInFB';

import { useNavigate } from "react-router-dom";

import { Typography, Button, TextField } from "@mui/material";

function SignUpPopup(props){
    const [submitError, setSubmitError] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [succesfulSignup, setSuccesfulSignup] = useState(null);
    const [isAvatarChosen, setIsAvatarChosen] = useState(null);
    const [succesfulSignupTimer, setSuccesfulSignupTimer] = useState(5);
    const [triggerRoute, setTriggerRoute] = useState(null);
    let navigate = useNavigate();

    useEffect(()=>{
        if(triggerRoute!=null){
            navigate(triggerRoute);
        }

    },[triggerRoute]);

    if(props.props.signup!=null){


        function createUser(email,password){

            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in 
                sessionStorage.setItem('user',userCredential.user.uid);

                
              })
              .then((idk)=>{setAvatar(true)})
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                const form = document.querySelector('.signup-info');
                if(errorCode=='auth/email-already-in-use'){
                    form.email.setCustomValidity('Email already in use');
                    form.email.reportValidity();
                    console.log(errorMessage);

                } else {
                    setSubmitError(true);
                }
              });
        }

        function formSubmit(e){
            e.preventDefault();
            const form = document.querySelector('.signup-info');
            // Check for blank inputs
            if(form.email.value == ''){
                form.email.setCustomValidity(`Email can't be blank`);
                form.email.reportValidity();
                return;
            };
            if(form.repeatEmail.value == ''){
                form.repeatEmail.setCustomValidity(`Email can't be blank`);
                form.repeatEmail.reportValidity();
                return;
            }
            if(form.password.value == ''){
                form.password.setCustomValidity(`Password can't be blank`);
                form.password.reportValidity();
                return;
            }
            if(form.repeatPassword.value == ''){
                form.repeatPassword.setCustomValidity(`Password can't be blank`);
                form.repeatPassword.reportValidity();
                return;
            }
            // Check email pattern validity
            if(form.email.validity.patternMismatch==true){
                form.email.setCustomValidity(`Email isn't valid`);
                form.email.reportValidity();
                return;
            }

            // Check password length validity
            if(form.password.validity.tooShort==true){
                form.password.setCustomValidity('Password must be at least 6 characters long');
                form.password.reportValidity();
                return;
            }

            // Check if repeat input fields are the same as the original ones
            if(form.email.value === form.repeatEmail.value){
                form.repeatEmail.setCustomValidity('');
                form.repeatEmail.reportValidity();

                if(form.password.value === form.repeatPassword.value){

                    form.repeatPassword.setCustomValidity('');

                    // do stuff with firebase - create a user with the given email and password
                    createUser(form.email.value,form.password.value);
                } else {
                    form.password.setCustomValidity('Passwords must match');
                    form.password.reportValidity();
                    form.repeatPassword.setCustomValidity('Passwords must match');
                    form.repeatPassword.reportValidity();
                }
            } else {
                form.email.setCustomValidity('Emails must match');
                form.email.reportValidity();
                form.repeatEmail.setCustomValidity('Emails must match');
                form.repeatEmail.reportValidity();

            }
        }



        return (
            <React.Fragment>
                {avatar ? <div className='choose-avatar-overlay'>
                    {!succesfulSignup ? <div className="choose-avatar">
                        <Typography variant="h3" color='primary' fontWeight={'bold'}>Choose your profile avatar</Typography>
                        <div className="avatar-line">
                            <img className="ada" src={require('../../Images/ProfileImages/ada.png')} onClick={(e)=>{setAvatarInFB(e.target.className,sessionStorage.getItem('user'));setIsAvatarChosen(true)}} tabIndex='1'></img>
                            <img className="bnb" src={require('../../Images/ProfileImages/bnb.png')} onClick={(e)=>{setAvatarInFB(e.target.className,sessionStorage.getItem('user'));setIsAvatarChosen(true)}} tabIndex='1'></img>
                            <img className="btc" src={require('../../Images/ProfileImages/btc.png')} onClick={(e)=>{setAvatarInFB(e.target.className,sessionStorage.getItem('user'));setIsAvatarChosen(true)}} tabIndex='1'></img>
                            <img className="dot" src={require('../../Images/ProfileImages/dot.png')} onClick={(e)=>{setAvatarInFB(e.target.className,sessionStorage.getItem('user'));setIsAvatarChosen(true)}} tabIndex='1'></img>
                            <img className="eth" src={require('../../Images/ProfileImages/eth.png')} onClick={(e)=>{setAvatarInFB(e.target.className,sessionStorage.getItem('user'));setIsAvatarChosen(true)}} tabIndex='1'></img>
                            <img className="usdt" src={require('../../Images/ProfileImages/usdt.png')} onClick={(e)=>{setAvatarInFB(e.target.className,sessionStorage.getItem('user'));setIsAvatarChosen(true)}} tabIndex='1'></img>
                        </div>
                        <Button variant="outlined" color="secondary" className="avatar-submit"
                            onClick={()=>{if(isAvatarChosen){
                                let i = 4;
                            setSuccesfulSignup(true);
                            setTimeout(() => {document.querySelector('.succesful-signup').style.opacity='1'}, 10);
                            setInterval(() => {
                                if(i > 0){
                                    setSuccesfulSignupTimer(i);
                                    i--;
                                } else {
                                    setTriggerRoute("/LoggedInApp");
                                }
                            }, 1000);
                            }}}>Continue</Button>
                    </div> :
                    <Typography variant="h5" className="succesful-signup">Your account has been created succesfully!<Typography variant="span" color='primary' className="succ-signup-timer">{succesfulSignupTimer}...</Typography></Typography>
                    
                    }
                </div> : 
                <div className="signup-popup" data-testid='signupPopup'>

                <div className="main-label">Enter your credentials below
                    <Button variant="outlined" style={{maxWidth:'10px', minWidth:'10px'}} onClick={()=>{props.props.loadSignup(null)}}>X</Button>
                </div>
                <form className="signup-info" name="signupForm" onSubmit={(e)=>{formSubmit(e)}} noValidate>
                    <div className="signup-email">
                            <TextField variant="filled" label='Email' type={'email'} name='email' required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"></TextField>
                            <TextField variant="filled" label='Repeat email' type={'email'} name='repeatEmail' required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"></TextField>
                    </div>
                    <div className="signup-password">
                            <TextField variant="filled" label='Password' type={'password'} name='password' required minLength={6}></TextField>
                            <TextField variant="filled" label='Repeat password' type={'password'} name='repeatPassword' required minLength={6}></TextField>
                    </div>
                    <Button variant="outlined" type="button" onClick={(e)=>{formSubmit(e)}}>Change my future!</Button>
                </form>
                {submitError ? <span className="signup-error" onClick={()=>{setSubmitError(null)}}>Uncaught error when trying to sign up</span> : null}
                </div>
                }
                
            </React.Fragment>

        )



    }

}
export default SignUpPopup;