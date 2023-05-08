import {Brand} from "./brand";
import {Category} from "./category";

export interface Inventory {
    brand_id: String
    category_id: String
    brand: Brand
    category: Category
    id:String
    invc_image: String
    inventory_id: String
    model: String
    sno: String
    status: Boolean
    un_id: String
    unit_price: String
    inventories: {
        id: String
        un_id: String
        vendor_id: String
        invoice_count: String
        invoice_date?: Date
        invoice_image?: String
        invoice_no?: String
        invoice_price: String
        unit_id: String
        unit: {
            id: String
            name: String
            status: Boolean
        }
    }
    created_at: Date
    updated_at?: Date
}