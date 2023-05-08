import { useState } from 'react'


const usePagination = (data: any[], itemsPerPage: number) => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemCount = data.length;

    const getCurrentData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return data.slice(start, end);
    };

    const pageCount = Math.ceil(itemCount / itemsPerPage)

    return {currentPage, getCurrentData, setCurrentPage, pageCount}
}

export default usePagination;
