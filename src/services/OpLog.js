import {OPLOG} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(OPLOG+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(OPLOG+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(OPLOG+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(OPLOG+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(OPLOG+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(OPLOG+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}