import React, {useEffect} from 'react'
import PageContainer from "../../components/containers/page-container";
import {updatePageTitle} from "../../slices/page-title-slice"
import {useDispatch} from "react-redux";
import {useParams} from "react-router";


export default function SingleAsset(){

    const dispatch = useDispatch()
    const params = useParams()

    useEffect(()=>{
        dispatch(updatePageTitle(`Asset ${params.inventoryId} Info`))
    }, [])

    return(
        <PageContainer>
           Page Coming Soon
        </PageContainer>
    )
}