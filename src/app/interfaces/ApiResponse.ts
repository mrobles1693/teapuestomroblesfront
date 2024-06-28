export interface ApiResponse<T>{
    success : boolean,
    errMsj : string,
    data : T,
}