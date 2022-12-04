import {ROLE} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(ROLE+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(ROLE+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(ROLE+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(ROLE+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(ROLE+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(ROLE+'undel', METHOD.POST, params,{})
}
export async function assign(params){
    return request(ROLE+'assign', METHOD.POST, params,{})
}
export async function get_assign(params){
    return request(ROLE+'get_assign', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel,
    assign,
    get_assign,
}