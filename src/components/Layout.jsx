import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, AppBar, Toolbar, IconButton, Typography, useTheme, useMediaQuery, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const drawerWidth = 240;

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const [value, setValue] = useState(location.pathname);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const mainNavItems = [
        { text: 'Dashboard', to: '/', icon: <DashboardIcon /> },
        { text: 'Accounts', to: '/accounts', icon: <AccountBalanceWalletIcon /> },
        { text: 'Transactions', to: '/transactions', icon: <SwapHorizIcon /> },
    ];

    const secondaryNavItems = [
        { text: 'Categories', to: '/categories', icon: <CategoryIcon /> },
        { text: 'Loans', to: '/loans', icon: <CreditCardIcon /> },
        { text: 'Incomes', to: '/incomes', icon: <AttachMoneyIcon /> },
    ];

    const drawer = (
        <List>
            {mainNavItems.concat(secondaryNavItems).map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton component={RouterLink} to={item.to} onClick={isMobile ? handleDrawerToggle : undefined}>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Personal Finance
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, pb: { xs: 7, sm: 3 } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
            {isMobile && (
                <BottomNavigation
                    sx={{ width: '100%', position: 'fixed', bottom: 0 }}
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    showLabels
                >
                    {mainNavItems.map((item) => (
                        <BottomNavigationAction
                            key={item.text}
                            label={item.text}
                            value={item.to}
                            icon={item.icon}
                            component={RouterLink}
                            to={item.to}
                        />
                    ))}
                </BottomNavigation>
            )}
        </Box>
    );
};

export default Layout;
