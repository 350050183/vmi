import {PRODUCTSKU} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(PRODUCTSKU+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(PRODUCTSKU+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(PRODUCTSKU+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(PRODUCTSKU+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(PRODUCTSKU+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(PRODUCTSKU+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}