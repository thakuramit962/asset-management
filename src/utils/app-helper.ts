export const capitalizeWords = (str: string = '', lower = false) => {
    return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}


export const camelCaseWords = (inputString: string) => {
    return inputString?.toLowerCase()?.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}

export const getFirstErrorMessage = (response: any) => {
    const errors = response
    const firstKey = Object.keys(errors)?.[0]
    return errors?.[firstKey]?.[0]
}


export const downloadFile = (data: any, fileName: string) => {
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link) // Clean up and remove the link
}


export const assetStatuses = [
    {label: 'All'},
    // {label: 'Cancel', code: 0}, not to include in code
    {label: 'Unassigned', code: 1},
    {label: 'Assigned', code: 2},
    {label: 'Scrapped', code: 3},
    {label: 'Handover to HR', code: 4},
    {label: 'Handover to Emp', code: 5},
    {label: 'Recovery Pending', code: 6},
    {label: 'Recovery Completed', code: 7},
    {label: 'Scrap Pending', code: 8},
    {label: 'Ready to Scrap', code: 9},
]

// export const serverRoute = 'http://192.168.5.31:8000/api'
export const serverRoute = 'https://demo-assets.easemyorder.com/api'