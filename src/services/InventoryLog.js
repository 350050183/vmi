import {INVENTORYLOG} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(INVENTORYLOG+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(INVENTORYLOG+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(INVENTORYLOG+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(INVENTORYLOG+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(INVENTORYLOG+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(INVENTORYLOG+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}