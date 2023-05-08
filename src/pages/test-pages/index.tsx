import React from 'react'
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueFormatterParams,
    GridValueGetterParams
} from "@mui/x-data-grid";
import {alpha, Box, Button, FormLabel} from "@mui/material";
import {useForm} from "react-hook-form";
import PageContainer from "../../components/containers/page-container";


export default function DataGridDemo() {


    function getFullName(params: GridValueGetterParams) {
        return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
    }

    const columns: GridColDef[] = [
        {field: 'firstName', headerName: 'First name' },
        {field: 'lastName', headerName: 'Last name'},
        {
            field: 'number', headerName: 'Numeric Value',
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                if (params.value != null) {
                    const valueFormatted = Number(params.value * 100).toLocaleString();
                    return `${valueFormatted} %`
                } else return ''
            },
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            // width: 160,
            valueGetter: getFullName,
            renderCell: (params: GridRenderCellParams<Date>) => (
                <strong>
                    <Button
                        variant="contained"
                        size="small"
                        style={{marginLeft: 16}}
                        tabIndex={params.hasFocus ? 0 : -1}
                    >
                        {params.value}
                    </Button>
                </strong>
            ),
        },
    ];
    const rows = [
        {id: 1, lastName: 'Snow', firstName: 'Jon'},
        {id: 2, lastName: 'Lannister', firstName: 'Cersei', number: 3},
        {id: 3, lastName: 'Lannister', firstName: 'Jaime'},
        {id: 4, lastName: 'Stark', firstName: 'Arya', number: 3},
        {id: 5, lastName: 'Targaryen', firstName: 'Daenerys'},
    ];

    return (
        <PageContainer>
        <DataGrid density={'compact'} rows={rows} columns={columns} autoPageSize autoHeight/>
        </PageContainer>
    )
}


export function TestPages() {

    const {handleSubmit, register} = useForm()

    const onSubmit = (data: any) => {
        console.log('demo data', data)
        console.log('demo data1', data.invoice_image[0])
    }

    return (
        <PageContainer>
            <Box component={'form'}>
                <Box sx={{
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '300px',
                    borderRadius: '20px',
                    padding: '6px',
                    position: 'relative',
                    border: '2px solid',
                    '&:has(input:focus, input:hover)':{
                        border: '2px dashed',
                    },
                    '& input': {
                        position: 'absolute',
                        inset: 0,
                        height: '100%',
                        width: '100%',
                        background: '#f16334',
                        // opacity: 0,
                        '&::-webkit-file-upload-button': {
                            display: 'none',
                        }
                    },
                    '& .MuiFormLabel-root': {
                        minHeight: '100px',
                        minWidth: '200px',
                        borderRadius: 'inherit',
                        background: '#f16334'

                    },
                }}>
                    <label htmlFor={'invoice_image'}>Invoice Image</label>

                    <input id={'invoice_image'} type={'file'} {...register('invoice_image')}/>
                </Box>
                <button onClick={handleSubmit(onSubmit)}>check</button>
            </Box>
        </PageContainer>
    )
}