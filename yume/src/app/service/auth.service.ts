import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo } from '../models/Grupo';
import { ResponseMessage } from '../models/ResponseMessage';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  inscreverUsuario(usuario: Usuario): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>("http://yumeeducacao.com.br/usuario", usuario)
  }

  criarGrupo(grupo: Grupo): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>("http://yumeeducacao.com.br/grupo", grupo)
  }
  
  convidarParticipantes(grupo: Grupo): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>("http://yumeeducacao.com.br/convite", grupo)
  }
}
