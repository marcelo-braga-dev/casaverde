import {Drawer, List, ListItem, Collapse, Typography, Stack, Box} from '@mui/material';
import {useMenu} from './DrawerContext.jsx';
import {adminMenu} from "../Drawer/MenuItens/Admin";
import {IconChevronDown, IconChevronUp, IconPoint, IconPointFilled} from "@tabler/icons-react";
import {Link} from "@inertiajs/react";
import {useMemo} from "react";
import {consultorMenu} from "../Drawer/MenuItens/Consultor.jsx";

const styleDrawer = {
    width: 280,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 270,
        boxSizing: 'border-box',
        marginTop: 0
    },
};

const styleDrawerItem = {pl: 4, borderBottom: 'none'};

export default function SideMenu() {

    const {openedMenu, openedSubMenu, toggleMenu, openMenuDrawer} = useMenu();
    const roleId = 1//usePage().props.auth.user.role_id;

    const menuItems = roleId === 1 ? adminMenu : consultorMenu;

    const menuPrimary = useMemo(() => {
        return menuItems.map((item) => (
            <div key={item.id}>
                <ListItem
                    onClick={() => toggleMenu(item.id)}
                    sx={{cursor: 'pointer', borderBottom: 'none', justifyContent: 'space-between'}}
                >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{color: item?.cor}}>
                        {item.icon}
                        <Typography variant="body1">{item.title}</Typography>
                    </Stack>
                    {openedMenu === item.id ? <IconChevronUp size={15}/> : <IconChevronDown size={15}/>}
                </ListItem>
                <Collapse in={openedMenu === item.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subItems.map((subItem, subIndex) => (
                            <Link key={subIndex} href={subItem.link}>
                                <ListItem sx={styleDrawerItem}>
                                    {subItem.id === openedSubMenu ? <IconPointFilled size={17}/> : <IconPoint size={17}/>}
                                    <Typography marginLeft={1} variant="body1">{subItem.title}</Typography>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Collapse>
            </div>
        ))
    }, [toggleMenu, openedMenu, openedSubMenu]);

    return (
        openMenuDrawer && <Drawer
            variant="permanent"
            anchor="left"
            sx={styleDrawer}
        >
            <List sx={{marginTop: 9}}>
                <Box sx={{paddingBottom: 2, paddingInline: 4}}>
                    <img src={`/storage/app/logo.png`} alt="logo" loading="lazy" style={{width: '100%'}}/>
                </Box>

                {menuPrimary}
            </List>
        </Drawer>
    );
}
