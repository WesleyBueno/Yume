import { Component, OnInit } from '@angular/core';
import { Grupo } from '../models/Grupo';
import { Usuario } from '../models/Usuario';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dbm',
  templateUrl: './dbm.component.html',
  styleUrls: ['./dbm.component.css']
})
export class DbmComponent implements OnInit {

  usuario: Usuario = new Usuario()
  grupo: Grupo = new Grupo()



  ngOnInit(): void {
    window.scroll(0, 0)

    this.grupo.integrantes = [new Usuario(), new Usuario(), new Usuario()]
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
      resp => {
        Swal.fire('Tudo certo!', 'Verifique seu email e clique no link enviado para ativar sua conta', 'success')
        console.log(resp)
        this.resetForms()
      },
      error => {
        Swal.fire('Algo deu errado!', 'Dados inválidos', 'error')
        console.log(error)
        this.resetForms()
      }
    )
  }

  criarGrupo() {
    this.auth.criarGrupo(this.grupo).subscribe(
      resp => {
        Swal.fire('Grupo criado!', 'Este código será usado para identificar o grupo.' + resp, 'success')
        console.log(resp)
        this.resetForms()
      }, error => {
        Swal.fire('Algo deu errado!', 'Dados inválidos', 'error')
        console.log(error)
        this.resetForms()
      }
    )
  }

  convidarGrupo() {
    this.auth.convidarParticipantes(this.grupo).pipe().subscribe(
      resp => {
        Swal.fire('Tudo certo!', 'Convites enviados', 'success')
        console.log(resp)
        this.resetForms()
      },
      error => {
        Swal.fire('Algo deu errado!', 'Houve um erro no envio dos convites. Tente novamente mais tarde', 'error')
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
