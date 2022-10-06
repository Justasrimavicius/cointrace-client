import { auth } from '../Firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography, Button, Input, TextField } from '@mui/material';

function LoginPopup(props){
    const [submitError, setSubmitError] = useState(null);
    let navigate = useNavigate();

    if(props.props.login!=null){
        console.log(props);
        function LoginUser(email,password,form){
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in 
                sessionStorage.setItem('user',userCredential.user.uid);

              })
              .then((x)=>{
                navigate('/LoggedInApp');
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                if(errorMessage=='Firebase: Error (auth/wrong-password).'){
                    form.password.setCustomValidity('Password is incorrect');
                    form.password.reportValidity();
                } else if(errorMessage=='Firebase: Error (auth/invalid-email).'){
                    form.email.setCustomValidity('Invalid email');
                    form.email.reportValidity();
                } else if(errorMessage=='Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).'){
                    form.email.setCustomValidity('Too many login attempts. Try again later');
                    form.email.reportValidity();
                } else if(errorMessage=='Firebase: Error (auth/user-not-found).'){
                    form.email.setCustomValidity('User does not exist');
                    form.email.reportValidity();
                } else {
                    setSubmitError(true);
                }
              });
        }

        function formSubmit(e){
            e.preventDefault();
            const form = document.querySelector('.login-info');
            const email = form.email.value;
            const password = form.password.value;
            LoginUser(email,password,form);
        }


        return (
            <div className="login-popup" data-testid='loginPopup'>
                <form className="login-info" name="loginInfo" onSubmit={(e)=>{formSubmit(e)}}>
                    <Typography variant='h5' className="login-label">Enter the information</Typography>
                        <TextField data-testid='loginEmail' label="Email" variant="filled" type={'email'} name='email' required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"></TextField>
                        <TextField data-testid='loginPassword' label="Password" variant="filled" type={'password'} name='password' required></TextField>
                    <div className="buttons">
                        <Button data-testid='loginButtonFinal' variant='outlined'  type="button" onClick={(e)=>{formSubmit(e)}}>Log in</Button>
                        <Button variant="outlined"  style={{maxWidth:'10px', minWidth:'10px'}} onClick={()=>{props.props.loadLogin(null)}}>X</Button>
                    </div>

                </form>
                {submitError ? <Typography variant='span' className="login-error" onClick={()=>{setSubmitError(null)}}>Uncaught error when trying to sign up</Typography> : null}

            </div>
        )

    }
}

export default LoginPopup;