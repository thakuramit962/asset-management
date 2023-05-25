export interface PaginatedData {
    current_page: number | null
    first_page_url: string | null
    from: number | null
    last_page: number | undefined
    last_page_url: string | null
    next_page_url: string | null
    path: string | null
    per_page: number | null
    prev_page_url: string | null
    to: number | null
    total: number | null
    link: LinkItem[]
}

interface LinkItem {
    active: boolean
    label: string | null
    url: string | null
}