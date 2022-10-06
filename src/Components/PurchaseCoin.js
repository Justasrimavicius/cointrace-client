import { Dialog, DialogTitle } from "@mui/material";
import { TextField, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useContext } from "react";
import { UserContext } from "./AuthComponents/UserContext";

import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./Firebase-config";

function PurchaseCoin(props){

    const [coinAmount, setCoinAmount] = useState(0);
    const [alert, setAlert] = useState(null);

    const context = useContext(UserContext);
    const UID = context.UID;

    function buyAmount(e){
        let inputValue=e.target.value;
        setTimeout(() => {
            if(e.target.value==inputValue){
                setCoinAmount(e.target.value/props.coin.market_data.current_price.usd);
            }
        }, 500);
    }

    function continuePurchase(coin, coinAmount){
        let oneCoinPrice = coin.market_data.current_price.usd;
        let priceInFiat = oneCoinPrice*coinAmount;


        const userData = getDoc(doc(db, 'users', `${UID}`))
        .then((user)=>{
            let availableFiat = user.data().fiat;
            if(priceInFiat<=availableFiat && priceInFiat!=0){
                console.log('purchase possible');
                let availableFiatTemp = parseFloat(availableFiat-priceInFiat).toFixed(2);
                updateDoc(doc(db,'users',`${UID}`),{
                    fiat:`${availableFiatTemp}`,
                })
                .then(()=>{
                    props.fiatAmountUI.setFiatAmount(parseFloat(availableFiatTemp).toFixed(2));
                    getDoc(doc(db,`users/${UID}/crypto`, `${coin.name}`))
                    .then(result=>{
                        if(typeof(result.data())!='object'){
                            setDoc(doc(db,`users/${UID}/crypto`, `${coin.name}`),{amount: `${coinAmount}`, name:`${coin.name}`})
                        } else {
                            let finalAmount = (parseFloat(result.data().amount) + parseFloat(coinAmount)).toFixed(5);
                            setDoc(doc(db,`users/${UID}/crypto`, `${coin.name}`),{amount: `${finalAmount}`, name:`${coin.name}`})
                        }
                    })
                    
                    console.log('success');
                    setTimeout(() => {
                        setAlert('Purchase succesful!');
                    }, 1000);

                })
            } else {
                console.log('purchase not possible');
                setAlert('Purchase not possible')

            }
        })
    }

    useEffect(()=>{
        if(alert!=null){
            setTimeout(() => {
                setAlert(null);
            }, 3000);
        }
    },[alert])


    return(
        <React.Fragment>
        <Dialog open={true}>
            <DialogTitle style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:'400px'}}>Purchase crypto<Button variant="outlined" onClick={()=>{props.state.setPurchaseCoinValue(null)}}>X</Button></DialogTitle>
            <TextField label='fiat amount' onChange={(e)=>{buyAmount(e)}}></TextField>
            {!isNaN(coinAmount) ? <Typography variant="h6" align="center">{props.coin.name} amount: {coinAmount.toFixed(5)} {props.coin.symbol}</Typography> : <Typography>Not a number</Typography>}
            <Button variant="text" onClick={()=>{continuePurchase(props.coin, coinAmount.toFixed(5))}}>Continue</Button>
        </Dialog>
        {alert ? <Dialog open={true}><Typography variant="h3">{alert}</Typography></Dialog> : null}
        </React.Fragment>
    )

}

export default PurchaseCoin;
