import React, {useEffect} from 'react'
import {Box} from "@mui/material";
import {updatePageTitle} from "../../slices/page-title-slice";
import {useDispatch} from "react-redux";
import {FormatQuoteRounded} from "@mui/icons-material";


const Dashboard = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(updatePageTitle('Dashboard'))
    }, [])

    return (
        <Box sx={{
            padding: 2,
            margin: 'auto',
            width: '94%',
            maxWidth: '800px',
            borderInline: '4px solid #000',
            borderRadius: '20px',
            position: 'relative',
            px: {xs: '1rem', sm: '3rem', md: '6rem'},
            minHeight: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .quote': {
                fontSize: 'clamp(4rem, 10vw, 6.5rem)',
                position: 'absolute',
                '&.top': {
                    transform: 'scale(-1)',
                    top: '-2.5rem',
                    left: '1rem',
                },
                '&.bottom': {
                    bottom: '-2.5rem',
                    right: '1rem',
                },
            },
            '& h2': {
                fontSize: 'clamp(1.5rem, 10vw, 2rem)',
            },
            '& blockquote': {
                textAlign: 'center',
                fontSize: 'clamp(1rem, 6vw, 1.2rem)',
                '&::first-letter': {
                    fontSize: '200%',
                },
            },
        }}>
            <FormatQuoteRounded className={'quote top'}/>
            <FormatQuoteRounded className={'quote bottom'}/>
            {/*<h2>Quote of the day</h2>*/}
            <blockquote>Your own mind is responsible for your mood.</blockquote>

        </Box>
    )
}

export default Dashboard;