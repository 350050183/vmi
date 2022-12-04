import {FILEMANAGER} from './api'
import {METHOD, request} from "@/utils/request";

export async function upload(params){
    return request(FILEMANAGER+'upload', METHOD.POST, params,{})
}

export default {
    upload,
}