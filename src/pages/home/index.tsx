// import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTranslation } from 'react-i18next';
import { Card, MenuItem, Modal, Popover, Toolbar } from '@mui/material';
import { LoggedUser, drawerItemInterface } from '../../types/types';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useUpdate } from '@/contexts/UpdateContext';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MyClients from '@/components/myClients';
import MyRents from '@/components/myRents';
import MyEquipments from '@/components/myEquipments';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
const drawerWidth = 240;


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const[refreshState, setRefreshState] = useState(false);
    const { toggleRefresh } = useUpdate();

    const [openCreateLocalModal, setOpenCreateLocalModal] = useState(false);
    const handleOpenCreateModal = () => setOpenCreateLocalModal(true);
    const handleCloseCreateModal = () => {setOpenCreateLocalModal(false); toggleRefresh()};


    const {i18n,t} = useTranslation("global");
    const router = useRouter();
    const [selectedComponent, setselectedComponent] = useState<drawerItemInterface>();
    const drawerItens: drawerItemInterface[] = [
    {
        name: 'Equipamentos',
        icon: HomeRepairServiceIcon,
        component: MyEquipments,
        key: '',
        visible: true

    },
    {
        name: 'Clientes',
        icon: GroupsIcon,
        component: MyClients,
        key: '',
        visible: true

    },
    {
        name: 'Alugueis',
        icon: CurrencyExchangeIcon,
        component: MyRents,
        key: '',
        visible: true

    },
    {
      name: t('logout'),
      icon: ExitToAppIcon,
      component: MyClients,
      key: 'logout',
      visible: true
  }
  ]

    const handleDrawerOpen = () => {
    setOpen(true);
    };

    const handleDrawerClose = () => {
    setOpen(false);
    };
    const logout = () => {
        // signOut();
        sessionStorage.removeItem('token');
        router.push('/login');
    }

    const handleDrawerItemCLicked = (item: any) => {
      // item.key == 'logout' ? logout() : setselectedComponent(item)
      if(item.key == 'logout'){
        logout();
        return;
      }
      else if(item.key == 'createLocal'){
        handleOpenCreateModal();
        return;
      }
      setselectedComponent(item);
    }

    return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
        <Toolbar sx={{backgroundColor: '#F46A29', height: '5vh'}}>
            <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
            }}
            >
            <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
            LocaTudo
            </Typography>
        </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} >
        <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {drawerItens.filter(item => item.visible == true).map((item, index) => (
            <ListItem key={index} disablePadding onClick={(e)=> {handleDrawerItemCLicked(item)}}>
                <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
                >
                <ListItemIcon
                    sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: item.key == 'logout' ? 'red' : '#F46A29'
                    }}
                >
                    <item.icon/>
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0, color: item.key == 'logout' ? 'red' : '#F46A29' }} />
                </ListItemButton>
            </ListItem>
        ))}
        </List>
        <Divider />
        </Drawer>

        <Box
            component="main"
            sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` },height:'94vh', marginTop: '6vh'}}
            >
                {selectedComponent ? (
                    <>
                      <selectedComponent.component/>
                    </>
                ) : (
                  <MyClients/>
                )}
            </Box>
    </Box>
    );
}