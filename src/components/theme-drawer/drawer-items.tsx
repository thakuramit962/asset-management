import React from 'react'
import {
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery
} from "@mui/material"
import {
    CategoryRounded,
    ExpandLessRounded, ExpandMoreRounded, Group, GroupRounded,
    HomeRounded, Inventory2Rounded, SellRounded,
    SettingsSuggestRounded,
    TaskAltRounded
} from "@mui/icons-material"
import {NavLink} from 'react-router-dom'


export default function DrawerItems(props: any) {

    const {toggleDrawer} = props


    const navItems = [
        {label: 'Home', link: '/', icon: HomeRounded},
        {label: 'Users', link: '/users', icon: GroupRounded, subMenus: []},
        {
            label: 'Inventory',
            link: '/tasks',
            icon: TaskAltRounded,
            subMenus: [
                {label: 'Assets', link: '/inventories', icon: Inventory2Rounded},
                {label: 'Categories', link: '/categories', icon: CategoryRounded},
                {label: 'Brands', link: '/brands', icon: SellRounded},
                // {label: 'Rss', link: '/demo', icon: TaskAltRounded,},
            ]
        },

    ]


    return (
        <NavigationItems componentType={'nav'} navItems={navItems} toggleDrawer={toggleDrawer}/>
    )
}


const NavItem = (props: any) => {
    const {onExpandMenu, open} = props
    return (
        <ListItem disablePadding onClick={onExpandMenu}>
            <ListItemButton>
                <ListItemIcon>
                    {props.subMenus
                        ? (open ? <ExpandLessRounded className={'expandArrow'}/> : <ExpandMoreRounded className={'expandArrow'}/>)
                        : props.icon && <props.icon/>}
                </ListItemIcon>
                <ListItemText primary={props.label}/>
            </ListItemButton>
        </ListItem>
    )
}

interface NavigationItemProps {
    label: string
    link: string
    icon: any
    subMenus?: NavigationItemProps[]
}

const NavigationItems = (props: any) => {

    const navItems: NavigationItemProps[] = props.navItems
    const toggleDrawer = props.toggleDrawer
    const componentType = props.componentType ?? 'div'
    const isSmallScreen = useMediaQuery('(max-width:900px)')


    const [open, setOpen] = React.useState(true)
    const handleClick = () => setOpen(!open)

    return (
        <List component={componentType}>
            {navItems.map((navItem, index) => {
                return (
                    navItem.subMenus &&
                    navItem.subMenus.length > 0
                        ? <>
                            <NavItem icon={navItem.icon} label={navItem.label} onExpandMenu={handleClick} open={open} subMenus/>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <NavigationItems navItems={navItem.subMenus} toggleDrawer={toggleDrawer}/>
                            </Collapse>
                        </>
                        : <NavLink key={index} to={navItem.link}
                                   className={({isActive}) => isActive ? 'activeNavlink' : ''}
                                   onClick={isSmallScreen ? toggleDrawer : () => {
                                   }}>
                            <NavItem icon={navItem.icon} label={navItem.label}/>
                        </NavLink>
                )
            })}
        </List>
    )
}