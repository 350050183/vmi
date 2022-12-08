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
export async function checkStatus(params){
    return request(ORDER+'checkStatus', METHOD.POST, params,{})
}
export async function backStatus(params){
    return request(ORDER+'backStatus', METHOD.POST, params,{})
}
export async function returnStatus(params){
    return request(ORDER+'returnStatus', METHOD.POST, params,{})
}
export async function cancelStatus(params){
    return request(ORDER+'cancelStatus', METHOD.POST, params,{})
}
export async function newStatusDelivery(params){
    return request(ORDER+'newStatusDelivery', METHOD.POST, params,{})
}
export async function checkStatusDelivery(params){
    return request(ORDER+'checkStatusDelivery', METHOD.POST, params,{})
}
export async function interceptStatusDelivery(params){
    return request(ORDER+'interceptStatusDelivery', METHOD.POST, params,{})
}
export async function returnStatusDelivery(params){
    return request(ORDER+'returnStatusDelivery', METHOD.POST, params,{})
}
export async function backStatusDelivery(params){
    return request(ORDER+'backStatusDelivery', METHOD.POST, params,{})
}

export default {
    index,
    get,
    add,
    edit,
    del,
    undel,
    checkStatus,
    backStatus,
    returnStatus,
    cancelStatus,
    newStatusDelivery,
    checkStatusDelivery,
    interceptStatusDelivery,
    returnStatusDelivery,
    backStatusDelivery,
}