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

  instrucao(){
    Swal.fire(
      'Inscrição',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Id diam maecenas ultricies mi eget mauris pharetra. Egestas integer eget aliquet nibh praesent tristique. Erat velit scelerisque in dictum non consectetur a. Sed libero enim sed faucibus. Nulla porttitor massa id neque aliquam vestibulum morbi. Ullamcorper malesuada proin libero nunc consequat interdum. Volutpat lacus laoreet non curabitur. Molestie nunc non blandit massa. Habitasse platea dictumst vestibulum rhoncus est pellentesque. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Amet volutpat consequat mauris nunc congue. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas. At auctor urna nunc id cursus metus aliquam eleifend. Pharetra massa massa ultricies mi quis hendrerit.'
      
    )
  }

  inscrever() {

    if (!this.validarFormularioUsuario()) return

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

    if (!this.validarFormularioGrupo()) return

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

    if (!this.validarFormularioConvite()) return

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

  validarFormularioUsuario() {
    if (!this.verificarCamposVazios(this.usuario)) {
      Swal.fire('Erro ao enviar formulário', 'Informe todos os campos do formulário', 'error')
      return false
    }

    if (!this.verificarEmail(this.usuario.email)) {
      Swal.fire('Erro ao enviar formulário', 'Email inválido', 'error')
      return false
    }

    if (!this.verificarCPF()) {
      Swal.fire('Erro ao enviar formulário', 'CPF inválido', 'error')
      return false
    }

    return true
  }

  validarFormularioGrupo() {
    if (!this.grupo.nome || !this.grupo.integrantes[0].email) {
      Swal.fire('Erro ao enviar formulário', 'Informe o nome do grupo e o email do representante', 'error')
      return false
    }

    if (!this.verificarEmail(this.grupo.integrantes[0].email)) {
      Swal.fire('Erro ao enviar formulário', 'Email inválido', 'error')
      return false
    }

    return true
  }
  
  validarFormularioConvite() {
    if (!this.grupo.token || (!this.grupo.integrantes[1].email && !this.grupo.integrantes[2].email)) {
      Swal.fire('Erro ao enviar formulário', 'Informe o código do grupo e o(s) email(s) dos convidados', 'error')
      return false
    }

    if (this.grupo.integrantes[1].email && !this.verificarEmail(this.grupo.integrantes[1].email)) {
      Swal.fire('Erro ao enviar formulário', 'Primeiro email inválido', 'error')
      return false
    }

    if (this.grupo.integrantes[2].email && !this.verificarEmail(this.grupo.integrantes[2].email)) {
      Swal.fire('Erro ao enviar formulário', 'Segundo email inválido', 'error')
      return false
    }

    return true
  }

  verificarCamposVazios(formulario: Object) {
    let campos = Object.entries(formulario)
    for (let i = 0; i < campos.length; i++) {
      if (!campos[i][1]) return false
    }
    return true
  }

  verificarEmail(email: string) {
    return email.match(/^[a-zA-Z0-9._+~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g)
  }

  verificarCPF() {
    if (this.usuario.cpf.length != 11) return false
    
    for (let i = 0; i < this.usuario.cpf.length; i++) {
        if (isNaN(Number(this.usuario.cpf[i]))) return false
    }

    let digitosRepetidos = false;
    for (let i = 0; i < (this.usuario.cpf.length - 1); i++) {
        if (this.usuario.cpf[i] == this.usuario.cpf[i + 1])
            digitosRepetidos = true
        else {
            digitosRepetidos = false
            break
        }
    }
    
    if (digitosRepetidos) return false

    let digitoVerificador, somaDigito = 0, multiplicador = 10, resto    
    for (let i = 0; i < (this.usuario.cpf.length - 2); i++, multiplicador--) {
        somaDigito += parseInt(this.usuario.cpf[i]) * multiplicador
    }
    
    resto = somaDigito % 11
    digitoVerificador = (resto < 2) ? 0 : (11 - resto)
    
    if (digitoVerificador != parseInt(this.usuario.cpf[9])) return false

    somaDigito = 0, multiplicador = 11
    for (let i = 0; i < (this.usuario.cpf.length - 1); i++, multiplicador--) {
        somaDigito += parseInt(this.usuario.cpf[i]) * multiplicador
    }
    
    resto = somaDigito % 11
    digitoVerificador = (resto < 2 ? 0 : 11 - resto)

    if (digitoVerificador != parseInt(this.usuario.cpf[10])) return false

    return true
  }

  resetForms() {
    this.usuario = new Usuario()
    this.grupo = new Grupo()
    this.grupo.integrantes = [new Usuario(), new Usuario(), new Usuario()]
  }
}
