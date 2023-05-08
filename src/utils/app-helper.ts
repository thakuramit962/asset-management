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



export const serverRoute = 'https://demo-assets.easemyorder.com/'
