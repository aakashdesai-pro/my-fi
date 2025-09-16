import { useState, useContext } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Typography, useTheme, useMediaQuery, BottomNavigation, BottomNavigationAction, Divider, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { ColorModeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const [value, setValue] = useState(location.pathname);
    const colorMode = useContext(ColorModeContext);
    const { logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

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

    const drawerContent = (
        <div>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <img src="/assets/logo-landscape-transparent.png" alt="logo" style={{ height: 40 }} />
            </Toolbar>
            <List sx={{ px: 2 }}>
                {mainNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            selected={location.pathname === item.to}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                                borderRadius: '8px',
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: 1.5 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List sx={{ px: 2 }}>
                {secondaryNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            selected={location.pathname === item.to}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                                borderRadius: '8px',
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: 1.5 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
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
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        MyFi
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={colorMode.toggleColorMode}>
                                <ListItemIcon>
                                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                </ListItemIcon>
                                <ListItemText primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </MenuItem>
                        </Menu>
                    </div>
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
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawerContent}
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
