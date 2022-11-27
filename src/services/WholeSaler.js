import {WHOLESALER} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(WHOLESALER+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(WHOLESALER+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(WHOLESALER+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(WHOLESALER+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(WHOLESALER+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(WHOLESALER+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}