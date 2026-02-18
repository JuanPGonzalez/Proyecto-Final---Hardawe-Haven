import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class suministroService {
  private baseUrl = environment.baseUrl + 'api/suministro/';
  constructor(
    private http: HttpClient
  ) { }
  getAll(){
    return this.http.get(`${this.baseUrl}getAll`);
  }
  getOne(id: number) {
     return this.http.get(`${this.baseUrl}getOne/${id}`);
   }
  getByUser(id: number) {
     return this.http.get(`${this.baseUrl}getByUser/${id}`);
   }
 create(body:{
  cantidad: number,
  idComponente: number,
  idUsuario: number
 }){
    return this.http.post(`${this.baseUrl}insert`, body);
  }
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}deleteOne/${id}`);
  }
  update( id: number, body:{
  cantidad: number,
  idComponente: number,
  idUsuario: number,
 fechaEntrega: Date | null}
  ){
    return this.http.put(`${this.baseUrl}update/${id}`, body);
  }
}



