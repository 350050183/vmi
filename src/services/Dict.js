import {DICT} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(DICT+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(DICT+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(DICT+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(DICT+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(DICT+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(DICT+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}