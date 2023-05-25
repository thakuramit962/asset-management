import React, {useEffect} from 'react'
import {Box, IconButton, Tooltip, Typography,} from "@mui/material";
import {updatePageTitle} from "../../slices/page-title-slice";
import {useDispatch} from "react-redux";
import {Add, FormatQuoteRounded} from "@mui/icons-material";
import PageContainer from "../../components/containers/page-container";
import {useNavigate} from "react-router-dom";
import API from "../../api";


const Dashboard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const quotes = [
        "Your own mind is responsible for your mood.",
        "Whoever is happy will make others happy too.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "The only impossible journey is the one you never begin.",
        "Live in the sunshine, swim the sea, drink the wild air.",
        "Love the life you live. Live the life you love.",
    ]

    const demoApiCall = () => {
        API.get(`/brands`)
            .finally(()=>console.log('api called'))
    }

    useEffect(() => {
        dispatch(updatePageTitle('Dashboard'))
        demoApiCall()
    }, [])

    return (
        <PageContainer>
            <Box sx={{
                height: '100%',
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'center',
                gap: 4,
                p: 3,
            }}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                }}>
                    <AnalyticsBox color={'#BACDDB'} value={'7878'} name={'Total Assets'}
                                  onClick={() => navigate('/create-inventory')}/>
                    <AnalyticsBox color={'#539165'} value={'7878'} name={'Assigned Assets'}
                                  onClick={() => navigate('/inventories')}/>
                    <AnalyticsBox color={'#E5BA73'} value={'7878'} name={'Un-assigned Assets'}
                                  onClick={() => navigate('/inventories')}/>
                    <AnalyticsBox color={'#FF6969'} value={'7878'} name={'Scrapped Assets'}
                                  onClick={() => navigate('/inventories')}/>
                </Box>

                <Box sx={{
                    maxWidth: '768px',
                    padding: 2,
                    margin: 'auto',
                    // flex: '1 1 768px',
                    borderRadius: '20px',
                    position: 'relative',
                    px: {xs: '1rem', sm: '3rem', md: '6rem'},
                    minHeight: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    justifySelf: 'flex-end',
                    // boxShadow: '0 0 17px -3px #83838380',
                    '& .quote': {
                        fontSize: 'clamp(4rem, 10vw, 5.2rem)',
                        position: 'absolute',
                        '&.top': {
                            transform: 'scale(-1)',
                            top: '1rem',
                            left: '1rem',
                        },
                        '&.bottom': {
                            bottom: '1rem',
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
                    <blockquote>{quotes[Math.floor(Math.random() * quotes.length)]}</blockquote>
                </Box>


            </Box>
        </PageContainer>
    )
}

export default Dashboard;


interface AnalyticsBoxProps {
    name: string
    value: string
    color: string
    onClick: () => void
}

const AnalyticsBox = (props: AnalyticsBoxProps) => {

    const {name, value, color, onClick} = props

    return (
        <Box sx={{
            background: color,
            color: '#fff',
            textShadow: '0 1px 3px #83838390',
            display: 'flex',
            justifyContent: 'center',
            flexFlow: 'column',
            flex: '1 1 200px',
            height: 'max-content',
            gap: 1,
            p: 2,
            borderRadius: '12px',
            position: 'relative',
            '& .valueName': {
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: 600,
            },
            '& .value': {
                fontSize: 'clamp(1.5rem, 8vw, 2rem)',
                fontWeight: 600,
                letterSpacing: '2px',
                lineHeight: 'clamp(1.5rem, 8vw, 2rem)',
            },
            '& .MuiIconButton-root': {
                position: 'absolute',
                right: '1rem',
                height: '1.5rem',
                width: '1.5rem',
                color: '#fff',
            },
        }}>
            <Typography className={'valueName'}>{name}</Typography>
            <Typography className={'value'}>{value}</Typography>
            <Tooltip title={'Add Asset to category'} arrow placement={'top'}>
                <IconButton onClick={onClick}><Add/></IconButton>
            </Tooltip>
        </Box>
    )
}