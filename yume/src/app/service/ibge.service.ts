import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseIBGE } from '../models/ResponseIBGE';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  constructor(private http: HttpClient) { }

  buscarMunicipiosPorEstado(id: number): Observable<ResponseIBGE[]> {
    return this.http.get<ResponseIBGE[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`)
  }

  buscarEstados(): Observable<ResponseIBGE[]> {
    return this.http.get<ResponseIBGE[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
  }
}
