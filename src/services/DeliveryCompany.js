import {DELIVERYCOMPANY} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(DELIVERYCOMPANY+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(DELIVERYCOMPANY+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(DELIVERYCOMPANY+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(DELIVERYCOMPANY+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(DELIVERYCOMPANY+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(DELIVERYCOMPANY+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}