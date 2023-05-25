import {Brand} from "./brand";
import {Category} from "./category";
import {PaginatedData} from "./paginated-data";


export interface Inventory extends PaginatedData {
    data: SingleInventory[]
}

export interface SingleInventory {
    asset_children?: string | null
    asset_children_id?: string | null
    asset_parent_id?: string | null
    asset_type?: string | null
    assign_emp_id?: string | null
    assign_emp_name?: string | null
    assigned_date?: Date | null
    brand?: Brand
    brand_id?: string | null
    cancelled_date?: string | null
    category?: Category
    category_id?: string | null
    id?: number | null
    invc_image?: string | null
    inventory_id?: string | null
    is_approved?: number | null
    model?: string | null
    remarks?: string | null
    scraped_date?: Date | null
    sno?: string | null
    status?: number | null
    un_id?: string | null
    unassigned_date?: Date | null
    undertaking?: string | null
    undertaking_image?: string | null
    unit_price?: string | null

    created_at?: Date
    updated_at?: Date
}