import {ROLE2PERMISSION} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(ROLE2PERMISSION+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(ROLE2PERMISSION+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(ROLE2PERMISSION+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(ROLE2PERMISSION+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(ROLE2PERMISSION+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(ROLE2PERMISSION+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}