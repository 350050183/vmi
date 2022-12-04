import {WHOLESALERSHOP} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(WHOLESALERSHOP+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(WHOLESALERSHOP+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(WHOLESALERSHOP+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(WHOLESALERSHOP+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(WHOLESALERSHOP+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(WHOLESALERSHOP+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}