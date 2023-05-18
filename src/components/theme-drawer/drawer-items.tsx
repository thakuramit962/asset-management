import React, {useState} from 'react'
import {
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, Tooltip,
    useMediaQuery
} from "@mui/material"
import {
    AssignmentLateRounded,
    CategoryRounded, DashboardRounded, DeleteSweepRounded,
    ExpandLessRounded, ExpandMoreRounded, GroupRounded,
    Inventory2Rounded, PersonAddRounded, PersonRemoveRounded, QueuePlayNextRounded, SellRounded,
    SummarizeRounded,
    TaskAltRounded, TextSnippetRounded
} from "@mui/icons-material"
import {NavLink} from 'react-router-dom'
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";


export default function DrawerItems(props: any) {

    const {toggleDrawer, isDrawerOpen} = props
    const user = useSelector((state: RootState) => state.userAuth?.currentUser)


    const navItems = [
        {label: 'Dashboard', link: '/', icon: DashboardRounded},
        ...(user?.role_id == '1'
            ? [{label: 'Users', link: '/users', icon: GroupRounded, subMenus: []},]
            : []),
        {
            label: 'Assets',
            link: '',
            icon: TaskAltRounded,
            subMenus: [
                {label: 'Create', link: '/create-inventory', icon: QueuePlayNextRounded},
                {label: 'List', link: '/inventories', icon: Inventory2Rounded},
                {label: 'Assign ', link: '/assign-asset', icon: PersonAddRounded},
                {label: 'Pullback', link: '/pullback-asset', icon: PersonRemoveRounded},
                {label: 'Scrap', link: '/scrap-asset', icon: DeleteSweepRounded},
            ]
        },
        {
            label: 'Reports',
            link: '',
            icon: TaskAltRounded,
            subMenus: [
                {label: 'Assets', link: '/demo', icon: SummarizeRounded},
                {label: 'UnAssigned Assets', link: '/configurations', icon: AssignmentLateRounded},
                {label: 'Undertakings ', link: '/undertakings', icon: TextSnippetRounded},
            ]
        },
        ...(user?.role_id == '1'
            ? [{
                label: 'Dropdowns',
                link: '',
                icon: TaskAltRounded,
                subMenus: [
                    {label: 'Categories', link: '/categories', icon: CategoryRounded},
                    {label: 'Brands', link: '/brands', icon: SellRounded},
                ]
            },]
            : []),
    ]


    return (
        <NavigationItems componentType={'nav'} navItems={navItems} isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}/>
    )
}


const NavItem = (props: any) => {
    const {onExpandMenu, open, isDrawerOpen} = props
    return (
        <ListItem disablePadding onClick={onExpandMenu}>
            <Tooltip title={!isDrawerOpen ? props.label : ''} arrow placement={'right'}>
                <ListItemButton>
                    <ListItemIcon>
                        {props.subMenus
                            ? (open ? <ExpandLessRounded className={'expandArrow'}/> :
                                <ExpandMoreRounded className={'expandArrow'}/>)
                            : props.icon && <props.icon/>}
                    </ListItemIcon>
                    <ListItemText primary={props.label}/>
                </ListItemButton>
            </Tooltip>
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
    const isDrawerOpen = props.isDrawerOpen
    const componentType = props.componentType ?? 'div'
    const isSmallScreen = useMediaQuery('(max-width:900px)')


    const [clickIndex, setClickIndex] = useState<number>(2)

    return (
        <List component={componentType}>
            {navItems.map((navItem, index) => {
                return (
                    navItem.subMenus &&
                    navItem.subMenus.length > 0
                        ? <React.Fragment key={index}>
                            <NavItem icon={navItem.icon} label={navItem.label} onExpandMenu={() => {
                                setClickIndex(index)
                                console.log(index)
                            }} open={index == clickIndex} subMenus isDrawerOpen={isDrawerOpen}/>
                            <Collapse in={index == clickIndex} timeout="auto" unmountOnExit>
                                <NavigationItems navItems={navItem.subMenus} toggleDrawer={toggleDrawer}/>
                            </Collapse>
                        </React.Fragment>
                        : <NavLink key={index} to={navItem.link}
                                   className={({isActive}) => isActive ? 'activeNavlink' : ''}
                                   onClick={isSmallScreen ? toggleDrawer : () => {
                                   }}>
                            <NavItem icon={navItem.icon} label={navItem.label} isDrawerOpen={isDrawerOpen}/>
                        </NavLink>
                )
            })}
        </List>
    )
}