import {ORDERLOG} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(ORDERLOG+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(ORDERLOG+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(ORDERLOG+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(ORDERLOG+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(ORDERLOG+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(ORDERLOG+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel,
}