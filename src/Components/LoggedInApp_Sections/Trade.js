import { Typography } from "@mui/material";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { Button } from "@mui/material";
import { TextField }from "@mui/material";
import { Avatar } from "@mui/material";

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase-config';

import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../AuthComponents/UserContext';

import axios from 'axios';
import numeral from "numeral";

import PurchaseCoin from '../PurchaseCoin.js';

function Trade(){

    const context = useContext(UserContext);
    const UID = context.UID;

    const [fiatAmount, setFiatAmount] = useState('0.00');
    const [coin, setCoin] = useState(null);

    const [purchaseCoinValue, setPurchaseCoinValue] = useState(null);

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




    function CallCryptoAPI(e){
        let searchValue=e.target.value;
        setTimeout(() => {
            if(searchValue==e.target.value){
                axios.get(`https://api.coingecko.com/api/v3/coins/${e.target.value}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
                .then((response)=>{
                    setCoin(response.data)
                })
                .catch((error)=>{
                    setCoin('not valid');
                })
            }
        }, 1000);
    }

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
        <div className='trade' style={{width:'100%'}}>
                <Typography variant='h6' align='center'>Your balance</Typography>
                <Typography variant='h3' align='center' data-testid='fiatAmount-trade'>{fiatAmount}$</Typography>

            <TextField variant='filled' fullWidth placeholder='Bitcoin, ethereum, solana, etc.' style={{height:'50px'}} onChange={(e)=>{CallCryptoAPI(e)}} className='trade-search'></TextField>
            <TableContainer style={{marginTop:'5px'}}>
                <Table aria-label="customized table" style={{overflow:'auto'}}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">Name</StyledTableCell>
                            <StyledTableCell align="right">Price</StyledTableCell>
                            <StyledTableCell align="right">Market cap</StyledTableCell>
                            <StyledTableCell align="right">24h change</StyledTableCell>
                            <StyledTableCell align="right">Purchase</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coin!=null ? 
                        coin!='not valid' ?
                        <TableRow>
                            <StyledTableCell align="left" style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'5px'}}><Avatar src={`${coin.image.small}`} />{coin.name}</StyledTableCell>
                            <StyledTableCell align="right">{coin.market_data.current_price.usd}$</StyledTableCell>
                            <StyledTableCell align="right">{numeral(coin.market_data.market_cap.usd).format('0.00a')}$</StyledTableCell>
                            {coin.market_data.market_cap_change_percentage_24h > 0 ? <StyledTableCell align="right" style={{color:'green'}}>{coin.market_data.market_cap_change_percentage_24h.toFixed(2)}%</StyledTableCell>
                            : <StyledTableCell align="right" style={{color:'red'}}>{coin.market_data.market_cap_change_percentage_24h.toFixed(2)}%</StyledTableCell>}
                            <StyledTableCell align="right"><Button variant="outlined" onClick={()=>{setPurchaseCoinValue(coin)}}>Buy</Button></StyledTableCell>
                        
                        </TableRow> :
                        <TableRow align='center'>
                            <StyledTableCell align="left">Coin not valid</StyledTableCell>
                            <StyledTableCell align="right">0.00$</StyledTableCell>
                            <StyledTableCell align="right">0.00$</StyledTableCell>
                            <StyledTableCell align="right">0%</StyledTableCell>
                            <StyledTableCell align="right"><Button variant="disabled">Buy</Button></StyledTableCell>
                        </TableRow>
                        
                        : null}
               
                    </TableBody>
                </Table>

             </TableContainer>
             {purchaseCoinValue ? <PurchaseCoin coin={purchaseCoinValue} state={{purchaseCoinValue,setPurchaseCoinValue}} fiatAmountUI={{fiatAmount, setFiatAmount}}/> : null}

        </div>
    )
}

export default Trade;