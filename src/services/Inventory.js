import {INVENTORY} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(INVENTORY+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(INVENTORY+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(INVENTORY+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(INVENTORY+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(INVENTORY+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(INVENTORY+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}