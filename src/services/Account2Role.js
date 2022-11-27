import {ACCOUNT2ROLE} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(ACCOUNT2ROLE+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(ACCOUNT2ROLE+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(ACCOUNT2ROLE+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(ACCOUNT2ROLE+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(ACCOUNT2ROLE+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(ACCOUNT2ROLE+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}