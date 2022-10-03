import { Dialog, DialogTitle, Typography } from "@mui/material";

import { db } from "../Firebase-config";
import { setDoc, doc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";

import { useState, useEffect } from "react";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from "@mui/material";
import { TextField }from "@mui/material";

import uniqid from 'uniqid';
import axios from "axios";

import { useContext } from "react";
import { UserContext } from "../AuthComponents/UserContext";
import { GetApp } from "@mui/icons-material";

function Portfolio(props){
    const [topupBtn, disableTopupBtn] = useState('text');
    const [alert, setAlert] = useState(null);

    const [balanceTopup, setBalanceTopup] = useState(null);
    const [fiatAmount, setFiatAmount] = useState('0.00');
    const [mockFiatAmount, setMockFiatAmount] = useState('0');
    const [coins, setCoins] = useState([]);
    const [coinsDisplay, setCoinsDisplay] = useState(null);

    const context = useContext(UserContext);
    const UID = context.UID;

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));

    useEffect(()=>{
        if(topupBtn=='disabled'){
            setDoc(doc(db, "users", `${UID}`), {topupBtn: `${topupBtn}`}, {merge: true});
        }
    },[topupBtn])
    useEffect(()=>{
        const userData = getDoc(doc(db, 'users', `${UID}`))
        .then((user)=>{
            if(user.data().fiat){
                setFiatAmount(parseFloat(user.data().fiat).toFixed(2));
            } else {
                setFiatAmount('0.00');
            }

            if(user.data().topupBtn=='disabled'){
                disableTopupBtn('disabled');
            }
        })

    },[]);

    useEffect(()=>{

        if(fiatAmount!='0.00'){
            updateDoc(doc(db, "users", `${UID}`), {fiat: `${fiatAmount}`});
        }
    },[fiatAmount])

    useEffect(()=>{
        if(alert!=null){
            setTimeout(() => {
                setAlert(null);
            }, 4000);
        }
    },[alert])

    function HandleTopup(){
        // check for too large topup amounts(100mil max)
        if(!mockFiatAmount.includes('.') && mockFiatAmount.length>9){
            setAlert('Topup sum is too big');
            return;
        } else if(mockFiatAmount.split('.')[0].length>9){
            setAlert('Topup sum is too big');
            return;
        }

        // add 0s to the end for better UI view
        if(!mockFiatAmount.includes('.')){

            setFiatAmount(mockFiatAmount+'.00');

        } 
        else if(mockFiatAmount.split('.')[1].length==1){
            setFiatAmount(mockFiatAmount+'0');
        }
        else if(mockFiatAmount.split('.')[1].length>2){
            setFiatAmount(mockFiatAmount.split('.')[0]+'.'+mockFiatAmount.split('.')[1].substring(0,2))
        } else {
            setFiatAmount(mockFiatAmount);
        }
        disableTopupBtn('disabled');
        setBalanceTopup(false);
}

    useEffect(()=>{
        getDocs(collection(db, `users/${UID}/crypto`))
        .then(result=>{
            async function getCoin(){
            for(let document of result.docs){
                const name = (document.data().name).toLowerCase();
                const amount = document.data().amount;
                let price;
                let avatarSrc;
                let priceChange24h;
                await axios.get(`https://api.coingecko.com/api/v3/coins/${name}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
                .then(result=>{
                    price=result.data.market_data.current_price.usd;
                    avatarSrc=result.data.image.small;
                    priceChange24h=result.data.market_data.price_change_percentage_24h;
                    let coin = {
                        name: `${name}`,
                        amount: `${amount}`,
                        price: `${price}`,
                        priceChange24h: `${priceChange24h}`,
                        avatarSrc: `${avatarSrc}`,
                    }
                    setCoins(currentArr => [coin, ...currentArr]);
                })
            }
                }
                getCoin();
        })

    },[])

    useEffect(()=>{
        console.log(coins);
        setCoinsDisplay(true);
    },[coins])

    return(
        <div className="portfolio">
            <div className="portfolio-left">
                <div className="portfolio-left-upper">
                    <Typography align="center" paddingTop='10px'>Fiat balance:</Typography>
                    <Typography variant="h3" className="portfolio-left-balance" align="center">{fiatAmount}$</Typography>
                </div>
                <div className="portfolio-left-coins">
                    <TableContainer style={{height:'75vh'}}>
                        <Table stickyHeader aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="left">Name</StyledTableCell>
                                    <StyledTableCell align="right">Balance</StyledTableCell>
                                    <StyledTableCell align="right">Price of 1</StyledTableCell>
                                    <StyledTableCell align="right">24h price change %</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coinsDisplay ? coins.map((coin)=>{
                                    return(<TableRow key={uniqid()}>
                                       <StyledTableCell align="left">{coin.name}</StyledTableCell>
                                       <StyledTableCell align="right">{coin.amount}</StyledTableCell>
                                       <StyledTableCell align="right">{coin.price}$</StyledTableCell>
                                       <StyledTableCell align="right">{parseFloat(coin.priceChange24h).toFixed(2)}%</StyledTableCell>
                                    </TableRow>)
                                }) : null }
                            </TableBody>
                        </Table>
                        {coins.length==0 ? <Button fullWidth onClick={()=>{props.loadFromSidePanel.loadSidePanelTab('trade')}}>No coins in your portfolio. Add some!</Button> : null}

                    </TableContainer>
                </div>
            </div>
            <div className="portfolio-right">
                <Button fullWidth style={{height:'161px', borderRadius:'0px', borderBottom:'1px solid black'}} variant={topupBtn} className='topup-button' onClick={()=>{setBalanceTopup(true)}} >Top up your balance</Button>
            </div>
            {balanceTopup ? 
                <Dialog open={true}>
                    <DialogTitle align="center">Type in an amount</DialogTitle>
                        <DialogTitle align="center">You can only topup your balance once - we recommend you insert a high amount(maximum 100 millions)</DialogTitle>
                    <TextField type='number' variant="filled" className="fiat-amount" placeholder="100000.00" onChange={(e)=>{setMockFiatAmount(e.target.value)}}></TextField>
                    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-around'}}>
                        <Button variant="outlined" fullWidth onClick={()=>{HandleTopup()}}>Continue</Button>
                        <Button variant="outlined" onClick={()=>{setBalanceTopup(false)}}>X</Button>
                    </div>
                </Dialog>
             : null}
             {alert ? <Dialog open={true}><DialogTitle>{alert}</DialogTitle></Dialog> : null}
        </div>
    )
}

export default Portfolio;