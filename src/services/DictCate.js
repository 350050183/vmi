import {DICTCATE} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(DICTCATE+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(DICTCATE+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(DICTCATE+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(DICTCATE+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(DICTCATE+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(DICTCATE+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}