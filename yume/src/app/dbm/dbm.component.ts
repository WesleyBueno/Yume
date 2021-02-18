import { Component, OnInit } from '@angular/core';
import { Grupo } from '../models/Grupo';
import { Usuario } from '../models/Usuario';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { ResponseMessage } from '../models/ResponseMessage';

@Component({
  selector: 'app-dbm',
  templateUrl: './dbm.component.html',
  styleUrls: ['./dbm.component.css']
})
export class DbmComponent implements OnInit {

  usuario!: Usuario
  grupo!: Grupo

  ngOnInit(): void {
    window.scroll(0, 0)
    this.resetForms()
  }
  
  constructor(private auth: AuthService) {
  }

  toggleForm() {
    let container = document.querySelector('#containerForm')
    container?.classList.toggle('active')
    document.querySelectorAll('.formBx').forEach(form => form.scrollTop = 0)
  }

  inscrever() {
    this.auth.inscreverUsuario(this.usuario).subscribe(
      (resp: ResponseMessage) => {
        Swal.fire('Tudo certo!', resp.message, 'success')
        console.log(resp)
        this.resetForms()
      },
      (error: ResponseMessage) => {
        Swal.fire('Algo deu errado!', error.message, 'error')
        console.log(error)
        this.resetForms()
      }
    )
  }

  criarGrupo() {
    this.auth.criarGrupo(this.grupo).subscribe(
      (resp: ResponseMessage) => {
        Swal.fire('Tudo certo!', resp.message, 'success')
        console.log(resp)
        this.resetForms()
      },
      (error: ResponseMessage) => {
        Swal.fire('Algo deu errado!', error.message, 'error')
        console.log(error)
        this.resetForms()
      }
    )
  }

  convidarGrupo() {
    this.auth.convidarParticipantes(this.grupo).pipe().subscribe(
      (resp: ResponseMessage) => {
        Swal.fire('Tudo certo!', resp.message, 'success')
        console.log(resp)
        this.resetForms()
      },
      (error: ResponseMessage) => {
        Swal.fire('Algo deu errado!', error.message, 'error')
        console.log(error)
        this.resetForms()
      }
    )
  }

  resetForms() {
    this.usuario = new Usuario()
    this.grupo = new Grupo()
    this.grupo.integrantes = [new Usuario(), new Usuario(), new Usuario()]
  }
}
