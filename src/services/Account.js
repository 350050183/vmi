import {ACCOUNT} from './api'
import {METHOD, request} from "@/utils/request";

export async function index(params){
    return request(ACCOUNT+'index', METHOD.GET, params,{})
}
export async function get(params){
    return request(ACCOUNT+'get', METHOD.GET, params,{})
}
export async function add(params){
    return request(ACCOUNT+'add', METHOD.POST, params,{})
}
export async function edit(params){
    return request(ACCOUNT+'edit', METHOD.POST, params,{})
}
export async function reset_password(params){
    return request(ACCOUNT+'resetPassword', METHOD.POST, params,{})
}
export async function del(params){
    return request(ACCOUNT+'del', METHOD.POST, params,{})
}
export async function undel(params){
    return request(ACCOUNT+'undel', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    reset_password,
    del,
    undel
}