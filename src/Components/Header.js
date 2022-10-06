import React, { useEffect, useState } from 'react';
import SignUpPopup from './AuthComponents/SignUpPopup';
import LoginPopup from './AuthComponents/LoginPopup'
import { useNavigate } from 'react-router-dom';

import { db } from './Firebase-config';
import { doc, getDoc } from "firebase/firestore"; 

import { Typography, Button } from '@mui/material';

function Header(props){



    const [signup, loadSignup] = useState(null);
    const [login, loadLogin] = useState(null);
    const [avatarLink, setAvatarLink] = useState(require(`../Images/ProfileImages/default.png`));

    const [triggerRoute, setTriggerRoute] = useState(null);
    let navigate = useNavigate();


    useEffect(()=>{
        if(props.props.loggedIn!=null){
            getAvatar();
        }
    },[props.props.loggedIn]);

    async function getAvatar(){
        try{
            const docRef = doc(db, "users", sessionStorage.getItem('user'));
            console.log(docRef)
            const docSnap = getDoc(docRef).then((e)=>{
            setAvatarLink(require(`../Images/ProfileImages/${e.data().avatar}.png`));
            });
        }
        catch{
        }
    }
    return (
        <React.Fragment>

            <div className="Header" data-testid='header'>
                <div className='header-left'>
                    <img src={require('../Images/btc.png')} height={'40px'}></img>
                    <Typography variant='h5' color='primary' margin={'5px'}>Your financial literacy begins here!</Typography>
                </div>
                <div className='header-right'>
                    {!props.props.loggedIn ? <Button variant='outlined' color='secondary' onClick={()=>{loadSignup(true)}} data-testid='signupButton'>Sign up</Button> : null}
                    {!props.props.loggedIn ? <Button variant='contained' color='secondary' onClick={()=>{loadLogin(true)}} data-testid='loginButton'>Log in</Button> : null}
                    {props.props.loggedIn ? <img src={avatarLink} className='header-avatar' width={'40px'} height={'40px'} tabIndex='1' data-testid='avatar'></img> : null}
                    {props.props.loggedIn ? <Button variant='contained' color='secondary' onClick={()=>{navigate('/')}}>Log out</Button> : null}
                </div>
            </div>
            <SignUpPopup props={{signup,loadSignup}} />
            <LoginPopup props={{login,loadLogin}} />

        </React.Fragment>



    )
}

export default Header;