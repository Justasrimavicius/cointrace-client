import React, { useEffect, useState } from 'react';
import SignUpPopup from '../AuthComponents/SignUpPopup';
import Header from '../Header';

import { Typography,Button } from '@mui/material';

function UnauthorizedApp() {
  const [signup, loadSignup] = useState(null);


  return (
    <React.Fragment>

        <Header props={{loggedIn:false}} />
        <div className="App">
          <div className='first-load-screen'>
            <div className='text'>
              <Typography variant='h2' color='secondary' fontWeight={'bold'}>Begin by signing up</Typography>
              <Typography variant='subtitle1' color='primary'>Your life can be changed forever by just a click of a button.</Typography>
              <Button variant='outlined' color='secondary' fullWidth onClick={()=>{loadSignup(true)}}>Sign up</Button>
            </div>
            <img src={require('../../Images/btc_phone.png')} height={'400px'} style={{margin:'50px'}}></img>
          </div>
        </div>
        <SignUpPopup props={{signup,loadSignup}} />

    </React.Fragment>
  );
}

export default UnauthorizedApp;
