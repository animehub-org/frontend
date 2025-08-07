import axios, {AxiosError, type AxiosResponse} from "axios";
// import {apiUrl} from "../const";
import type ResponseType from "../types/ResponseType";
import {getDeviceIndentifier} from "./userFunctions";

export async function getFromApi<T>(url: string, headers: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
    const header = {
        "Content-Type": "application/json",
        ...headers
    }
    const response = await axios.get<ResponseType<T>>(`${import.meta.env.API_URL}/g${url}`,{
        headers: header
    });
    if(response.status !== 200){
        throw new AxiosError(response.data.message);
    }
    return response;
}

export async function postToApi<T,R>(url: string, data: T, headers: object | null = null): Promise<AxiosResponse<ResponseType<R>>> {
    const header = {
        "Content-Type": "application/json",
        ...headers
    }
    const response = await axios.post<ResponseType<R>>(`${import.meta.env.API_URL}/p${url}`, data,{
        headers:header
    })
    if(response.status !== 200){
        throw new AxiosError(response.data.message);
    }
    return response;

}

export async function getFromApiWithToken<T>(url: string):Promise<AxiosResponse<ResponseType<T>>>{
    const identifier = getDeviceIndentifier()
    const response = await getFromApi<T>(url,{
        'timeZone': identifier.timeZone,
        'webGlRenderer': identifier.WegGl?.renderer,
        'webGlVendor': identifier.WegGl?.vendor,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    })

    if(response.status !== 200){
        throw new AxiosError(response.data.message);
    }
    return response;
}

export async function postToApiWithToken<T,R>(url: string, data: T):Promise<AxiosResponse<ResponseType<R>>>{
    const identifier = getDeviceIndentifier()
    const response = await postToApi<T,R>(url,data,{
        'timeZone': identifier.timeZone,
        'webGlRenderer': identifier.WegGl?.renderer,
        'webGlVendor': identifier.WegGl?.vendor,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    })
    if(response.status !== 200){
        throw new AxiosError(response.data.message);
    }
    return response;
}

// export async function fetchUser(
//     path: string,
//     method: "POST" | "DELETE" | "PATCH" | "GET" = "POST",
//     body?: any,
//     retry: boolean = true
// ): Promise<Response> {
//     const identifier = getDeviceIndentifier()
//     let response = await fetch(path, {
//         method,
//         headers: {
//             'Content-Type': "application/json",
//             'timeZone': identifier.timeZone,
//             'webGlRenderer': identifier.WegGl?.renderer,
//             'webGlVendor': identifier.WegGl?.vendor,
//             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify(body)
//     })
//     if (!response.ok && response.status === 401 && retry) {
//         await refreshToken()
//         response = await fetchUser(path, method, body, false)
//     }
//     return response
// }