import {PERMISSION} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(PERMISSION+'index', METHOD.GET, params,{})
}
export async function tree(params){
    return request(PERMISSION+'tree', METHOD.GET, params,{})
}
export async function get(params){
    return request(PERMISSION+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(PERMISSION+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(PERMISSION+'edit', METHOD.POST, params,{})
}
export async function editSort(params){
    return request(PERMISSION+'editSort', METHOD.POST, params,{})
}
export async function del(params){
    return request(PERMISSION+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(PERMISSION+'undel', METHOD.POST, params,{})
}

export default {
    index,
    tree,
    get,
    add,
    edit,
    editSort,
    del,
    undel
}