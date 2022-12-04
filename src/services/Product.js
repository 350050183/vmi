import {PRODUCT} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(PRODUCT+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(PRODUCT+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(PRODUCT+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(PRODUCT+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(PRODUCT+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(PRODUCT+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}