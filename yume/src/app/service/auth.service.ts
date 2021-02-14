import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo } from '../models/Grupo';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  inscreverUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>("http://localhost:8080/auth/usuario/cadastrar", usuario)
  }

  criarGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>("http://localhost:8080/auth/grupo/criar", grupo)
  }
  
  convidarParticipantes(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>("http://localhost:8080/auth/grupo/convidar", grupo)
  }
}
