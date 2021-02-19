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

  instrucao(){
    Swal.fire(
      'Inscrição',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Id diam maecenas ultricies mi eget mauris pharetra. Egestas integer eget aliquet nibh praesent tristique. Erat velit scelerisque in dictum non consectetur a. Sed libero enim sed faucibus. Nulla porttitor massa id neque aliquam vestibulum morbi. Ullamcorper malesuada proin libero nunc consequat interdum. Volutpat lacus laoreet non curabitur. Molestie nunc non blandit massa. Habitasse platea dictumst vestibulum rhoncus est pellentesque. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Amet volutpat consequat mauris nunc congue. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas. At auctor urna nunc id cursus metus aliquam eleifend. Pharetra massa massa ultricies mi quis hendrerit.'
      
    )
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
