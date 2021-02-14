import { Component, OnInit } from '@angular/core';
import { Grupo } from '../models/Grupo';
import { Usuario } from '../models/Usuario';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-dbm',
  templateUrl: './dbm.component.html',
  styleUrls: ['./dbm.component.css']
})
export class DbmComponent implements OnInit {

  usuario: Usuario = new Usuario()
  grupo: Grupo = new Grupo()

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.grupo.integrantes = [new Usuario(), new Usuario(), new Usuario()]
  }

  toggleForm() {
    var container = document.querySelector('#containerForm');
    container?.classList.toggle('active')
  }

  inscrever() {
    this.auth.inscreverUsuario(this.usuario).subscribe(resp => {
      console.log(resp)
      this.usuario = new Usuario()
    })
  }

  criarGrupo() {
    this.auth.criarGrupo(this.grupo).subscribe(resp => {
      console.log(resp)
      this.grupo = new Grupo
      this.grupo.integrantes = this.grupo.integrantes = [new Usuario(), new Usuario(), new Usuario()]
    })
  }

  convidarGrupo() {
    this.auth.convidarParticipantes(this.grupo).subscribe(resp => {
      console.log(resp)
      this.grupo = new Grupo
      this.grupo.integrantes = [new Usuario(), new Usuario(), new Usuario()]
    })
  }
}
