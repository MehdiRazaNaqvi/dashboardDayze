import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from "../assets/images/logo.svg"

import "../screens/dashboard/style.css"


const drawerWidth = 270;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div style={{ paddingLeft: "1rem", backgroundColor:"#FCF7F7" , paddingRight: "1rem", height: "100%", width: "240px" }}>
            <List sx={{ display: "flex", width: "100%" }}>

                <ListItem sx={{ borderRadius: "0.5rem", height: "5rem", width: "100%" }} >
                    <ListItemButton sx={{ borderRadius: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <ListItemIcon>
                            {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                            <img src={logo} alt="logo" style={{ width: "100%", height: "100%" }} />
                        </ListItemIcon>
                        {/* <ListItemText primary={text} /> */}
                    </ListItemButton>
                </ListItem>

            </List>


            <List sx={{ gap: "0.2rem", display: "flex", flexDirection: "column" }}>
                {['Overview', 'Dashboard', 'Users', 'Calendar', 'Events', 'Projects', 'Overview', 'Overview', 'Overview'].map((text, index) => (
                    <ListItem sx={{ borderRadius: "0.5rem", height: "3rem" }} key={text} disablePadding>
                        <ListItemButton sx={{ borderRadius: "0.5rem" }}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText disableTypography className="sidebar_text" primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>


        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;



}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;