import {SKU} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(SKU+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(SKU+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(SKU+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(SKU+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(SKU+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(SKU+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}