import React, { useContext, useEffect, useState } from 'react'

import { Button, TableBody, TableCell, tableCellClasses, TableContainer, Typography } from "@mui/material";
import { Table, TableHead, TableRow, StyledTableCell } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';


import { UserContext } from '../AuthComponents/UserContext';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase-config';

import axios from 'axios';
import uniqid from 'uniqid';
import numeral from 'numeral';

function Home(props){
    const context = useContext(UserContext);
    const UID = context.UID;

    const [fiatAmount, setFiatAmount] = useState('00.00');
    const [coins, setCoins] = useState([]);
    let coinsNames = ['bitcoin', 'ethereum', 'polkadot', 'chainlink', 'cardano'];

    useEffect(()=>{ // updates fiat money in UI
        const userData = getDoc(doc(db, 'users', `${UID}`))
        .then((user)=>{
            if(user.data().fiat){
                setFiatAmount(user.data().fiat);
            } else {
                setFiatAmount('0.00');
            }
        })
    },[]);

    useEffect(()=>{
        coinsNames.forEach((coin)=>{
            axios.get(`https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
            .then((response)=>{
                setCoins(currentArr => [response.data, ...currentArr]);
            })
            .catch((error)=>{
            })
        })
    },[])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
    return(
        <React.Fragment>
            <div className='home'>
                <div className="middle">
                <div className="middle-balance">
                    <Typography variant="h6">Your balance</Typography>
                    <Typography variant="h3" className="middle-balance-number" >{fiatAmount}$<ArrowForwardIosIcon className='home-arrow' style={{marginBottom:'4px'}} onClick={()=>{props.loadFromSidePanel.loadSidePanelTab('portfolio')}}/></Typography>
                    
                </div>
                <div className="middle-coins">
                    <div className="middle-coins-top">
                    <Typography variant="h6" style={{marginLeft: '5px'}}>Popular coins</Typography>
                    <ShoppingCartCheckoutIcon style={{margin: '5px'}} className='middle-coins-top-icon' onClick={()=>{props.loadFromSidePanel.loadSidePanelTab('trade')}}/>
                    </div>
                    <div className="middle-coins-bottom">
                        <TableContainer  style={{overflow:'auto', height:'100%'}}>
                            <Table height='100%' data-testid='home-table'>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell align='right'>Current price $</StyledTableCell>
                                        <StyledTableCell align='right'>Market cap %</StyledTableCell>
                                        <StyledTableCell align='right'>Market cap change 24h %</StyledTableCell>
                                        <StyledTableCell>Purchase</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{overflow:'hidden'}}>
                                {coins!=[] ? 
                                    coins.map(coin=>{
                                        return (
                                        <TableRow key={uniqid()}>
                                            <StyledTableCell align="right" style={{textAlign:'center', minHeight:'40px', maxHeight:'40px',borderBottom:'1px solid gray'}} ><Avatar src={`${coin.image.small}`} style={{width:'25px', height:'25px',transform:'translate(-50%)', marginLeft: '50%'}} />{coin.name}</StyledTableCell>
                                            <StyledTableCell align="right">{coin.market_data.current_price.usd.toFixed(2)}$</StyledTableCell>
                                            <StyledTableCell align="right">{numeral(coin.market_data.market_cap.usd).format('0.00a')}$</StyledTableCell>
                                            {coin.market_data.market_cap_change_percentage_24h > 0 ? <StyledTableCell align="right" style={{color:'green'}}>{coin.market_data.market_cap_change_percentage_24h.toFixed(2)}%</StyledTableCell>
                                            : <StyledTableCell align="right" style={{color:'red'}}>{coin.market_data.market_cap_change_percentage_24h.toFixed(2)}%</StyledTableCell>}
                                            <StyledTableCell style={{borderBottom:'1px solid gray'}}><Button variant="outlined" style={{height:'30px'}} onClick={()=>{props.loadFromSidePanel.loadSidePanelTab('trade')}}>Buy</Button></StyledTableCell>
                                        </TableRow>)
                                    }) : null}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                </div>
                <div className="right-side">
                <div className="right-side-upper">
                    <Button variant="text" align="center" fullWidth onClick={()=>{window.open('https://cryptoliteracy.org/quiz/')}}>Check your crypto knowledge!</Button>
                </div>
                <div className="right-side-lower">
                    <div className="nft">
                        <Typography variant="subtitle1" style={{alignSelf:'center', margin:'10px'}}>What are NFTs and where did they come from?</Typography>
                        <img src={require('../../Images/nft.png')} width='140px' style={{alignSelf:'center'}} onClick={()=>{window.open('https://www.investopedia.com/non-fungible-tokens-nft-5115211')}}></img>
                    </div>
                    <div className="staking">
                        <img src={require('../../Images/staking.png')} width='140px' style={{alignSelf:'center'}} onClick={()=>{window.open('https://www.coindesk.com/learn/crypto-staking-101-what-is-staking/')}}></img>
                        <Typography variant="subtitle1" style={{alignSelf:'center', margin:'10px'}}>What is staking and why is it so amazing?</Typography>
                    </div>
                    <div className="blockchain">
                        <Typography variant="subtitle1" style={{alignSelf:'center', margin:'10px'}}>How the allmighty blockchain works</Typography>
                        <img src={require('../../Images/blockchain.png')} width='140px' style={{alignSelf:'center'}} onClick={()=>{window.open('https://www.investopedia.com/terms/b/blockchain.asp')}}></img>
                    </div>
                </div>
                </div>
                <div className="footer">
                <span>@2022 <a href="https://github.com/Justasrimavicius/" style={{textDecoration:'none'}}>https://github.com/Justasrimavicius/</a></span>
                <Button variant="text" color="secondary" onClick={()=>{window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}}>Click me for a surprise</Button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;