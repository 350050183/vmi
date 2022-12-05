import {ORDER} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(ORDER+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(ORDER+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(ORDER+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(ORDER+'edit', METHOD.POST, params,{})
}
export async function del(params){
    return request(ORDER+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(ORDER+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel
}