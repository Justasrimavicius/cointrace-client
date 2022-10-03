import React, { useEffect, useState } from "react";
import Header from "../Header";
import Home from "../LoggedInApp_Sections/Home";
import Portfolio from '../LoggedInApp_Sections/Portfolio';
import Trade from '../LoggedInApp_Sections/Trade';

import { Button, List, ListItem, ListItemText, Divider, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HomeIcon from '@mui/icons-material/Home';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { UserContext } from "../AuthComponents/UserContext";
import { useNavigate } from "react-router-dom";

function LoggedInApp(){

    const [sidePanelTab, loadSidePanelTab] = useState('home');
    const navigate = useNavigate();
    let UID = sessionStorage.getItem('user');




    return(
        <React.Fragment>
            <UserContext.Provider value={{UID}}>
            <Header props={{loggedIn:true}}/>

            <div className="logged-in-app" data-testid='LoggedInApp'>
                <div className="left-side">
                    <List style={{paddingTop:'0'}} className="left-side-list">

                        <ListItemButton onClick={()=>{loadSidePanelTab('home')}}>
                            <ListItemIcon><HomeIcon/></ListItemIcon>
                            <ListItem>
                                <ListItemText>Home</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <ListItemButton onClick={()=>{loadSidePanelTab('portfolio')}}>
                            <ListItemIcon><AllInboxIcon/></ListItemIcon>
                            <ListItem>
                                <ListItemText>Portfolio</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <ListItemButton onClick={()=>{loadSidePanelTab('trade')}}>
                        <ListItemIcon><ShowChartIcon/></ListItemIcon>
                            <ListItem>
                                <ListItemText>Trade</ListItemText>
                            </ListItem>
                        </ListItemButton>

                        <Divider />
                    </List>
                    <Button variant="contained" color="secondary" style={{borderRadius:'5px 5px 0px 5px'}} onClick={()=>{navigate('/')}}>Log out</Button>
                </div>
                {sidePanelTab=='home' ? <Home loadFromSidePanel={{sidePanelTab, loadSidePanelTab}}/> : null}
                {sidePanelTab=='portfolio' ? <Portfolio loadFromSidePanel={{sidePanelTab, loadSidePanelTab}}/> : null}
                {sidePanelTab=='trade' ? <Trade /> : null}


            </div>
            </UserContext.Provider>
        </React.Fragment>

    )
}

export default LoggedInApp;