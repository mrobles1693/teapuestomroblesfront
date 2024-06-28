import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/ApiResponse';
import { SqlRspDTO } from 'src/app/interfaces/SqlRspDTO';
import { getBackUrl } from 'src/main';
import { CiudadDTO } from './interfaces/CiudadDTO';
import { InsPasajeroDTO, InsReservaDTO } from './interfaces/ReservaDTO';
import { getPrecioProgramacioVueloDTO, ProgramacionVueloDTO, searchProgramacionVueloDTO } from './interfaces/ProgramacionVueloDTO';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  urlRuta = '';
  urlReserva = '';

  constructor(
    private http : HttpClient
  ) { 
    this.urlRuta = `${getBackUrl()}Ruta/`;
    this.urlReserva = `${getBackUrl()}Reserva/`;
  }

  getListOrigen(): Observable<ApiResponse<CiudadDTO[]>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.get<ApiResponse<CiudadDTO[]>>(`${this.urlRuta}getListOrigen`, {headers: httpHeader});
  }

  getListDestino(nIdCiudadOrigen : number): Observable<ApiResponse<CiudadDTO[]>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    const httpParams = new HttpParams()
    .append('nIdCiudadOrigen', nIdCiudadOrigen);
    return this.http.get<ApiResponse<CiudadDTO[]>>(`${this.urlRuta}getListDestino`, {headers: httpHeader, params: httpParams});
  }

  getListProgramacion(elemento : searchProgramacionVueloDTO): Observable<ApiResponse<ProgramacionVueloDTO[]>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<ProgramacionVueloDTO[]>>(`${this.urlRuta}getListProgramacion`, elemento, {headers: httpHeader});
  }

  getPrecioFinal(elemento : getPrecioProgramacioVueloDTO): Observable<ApiResponse<number>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<number>>(`${this.urlRuta}getPrecioFinal`, elemento, {headers: httpHeader});
  }

  postInsReserva(elemento : InsReservaDTO): Observable<ApiResponse<SqlRspDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<SqlRspDTO>>(`${this.urlReserva}postInsReserva`, elemento, {headers: httpHeader});
  }

  cancelarReserva(nIdReserva : number): Observable<ApiResponse<SqlRspDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    const httpParams = new HttpParams()
    .append('nIdReserva', nIdReserva);
    return this.http.get<ApiResponse<SqlRspDTO>>(`${this.urlReserva}cancelarReserva`, {headers: httpHeader, params: httpParams});
  }

  finalizarReserva(nIdReserva : number): Observable<ApiResponse<SqlRspDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    const httpParams = new HttpParams()
    .append('nIdReserva', nIdReserva);
    return this.http.get<ApiResponse<SqlRspDTO>>(`${this.urlReserva}finalizarReserva`, {headers: httpHeader, params: httpParams});
  }

  postInsPasajero(elemento : InsPasajeroDTO): Observable<ApiResponse<SqlRspDTO>>{
    const httpHeader = new HttpHeaders({'Content-type':'application/json'});
    return this.http.post<ApiResponse<SqlRspDTO>>(`${this.urlReserva}postInsPasajero`, elemento, {headers: httpHeader});
  }
}
