import { Component, OnInit } from '@angular/core';
import { Grupo } from '../models/Grupo';
import { Usuario } from '../models/Usuario';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { ResponseMessage } from '../models/ResponseMessage';
import { IbgeService } from '../service/ibge.service';
import { ResponseIBGE } from '../models/ResponseIBGE';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-dbm',
  templateUrl: './dbm.component.html',
  styleUrls: ['./dbm.component.css']
})
export class DbmComponent implements OnInit {

  usuario!: Usuario
  grupo!: Grupo
  estados!: ResponseIBGE[]
  municipios!: ResponseIBGE[]

  ngOnInit(): void {
    window.scroll(0, 0)
    this.resetForms()
    this.buscarEstados()
  }
  
  constructor(private auth: AuthService, private ibge: IbgeService) {
  }

  toggleForm() {
    let container = document.querySelector('#containerForm')
    container?.classList.toggle('active')
    document.querySelectorAll('.formBx').forEach(form => form.scrollTop = 0)
  }



  instrucao(){
    Swal.fire(
      'Inscrição',
      '1. Faça sua inscrição individual preenchendo todos os campos abaixo com informações válidas.' 
      + '<br>' + 
      '2. Verifique o email de autenticação enviado para o endereço de email informado.' 
      + '<br>' + 
      '3. Faça a autenticação do seu usuário clicando no link informado no corpo do email.' 
      + '<br>' +  
      '4. Se você for o <b>representante</b> do grupo vá para a sessão de "Criar grupo", de um nome para o seu grupo e informe seu email autenticado para criar o grupo.' 
      + '<br>' + 
      '5. Se você for o <b>representante</b> do grupo verifique seu email. Será enviado o código do grupo por lá.' 
      + '<br>' + 
      '6. Se você for o <b>representante</b> do grupo preencha os campos da sessão de "Convide participantes" com o código do grupo informado por email do <b>representante</b> e com os emails autenticados dos membros do grupo.' 
      + '<br>' +  
      "7. Caso você <b>não seja o representante do grupo</b>, aguarde o representante criar o grupo e enviar o convite para o email informado na inscrição individual." 
      + '<br>' + 
      '8. Após receber o email, clique em aceitar o convite e você será colocado dentro do grupo e já estará pronto para a olimpíada!'

    )
  }

  buscarEstados() {
    this.ibge.buscarEstados().subscribe((estados: ResponseIBGE[]) => {
      this.estados = estados
    })
  }

  buscarMunicipiosPorEstado() {
    let id = this.pegarIdEstado(this.usuario.estado)
    if (id < 0) return

    this.ibge.buscarMunicipiosPorEstado(id).subscribe((municipios: ResponseIBGE[]) => {
      this.municipios = municipios
    })
  }

  pegarIdEstado(estado: string): number {
    for (let i = 0; i < this.estados.length; i++) {
      if (this.estados[i].nome == estado) return this.estados[i].id
    }
    return -1
  }

  inscrever() {

    if (!this.validarFormularioUsuario()) return

    this.auth.inscreverUsuario(this.usuario).subscribe(
      (resp: ResponseMessage) => {
        Swal.fire('Tudo certo!', resp.message, 'success')
        this.resetForms()
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Algo deu errado!', error.error.message, 'error')
        this.resetForms()
      }
    )
  }

  criarGrupo() {

    if (!this.validarFormularioGrupo()) return

    this.auth.criarGrupo(this.grupo).subscribe(
      (resp: ResponseMessage) => {
        Swal.fire('Tudo certo!', resp.message, 'success')
        this.resetForms()
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Algo deu errado!', error.error.message, 'error')
        this.resetForms()
      }
    )
  }

  convidarGrupo() {

    if (!this.validarFormularioConvite()) return
    
    let grupo = new Grupo()
    Object.assign(grupo, this.grupo)
    grupo.integrantes = grupo.integrantes.filter(integrante => integrante.email)

    this.auth.convidarParticipantes(grupo).pipe().subscribe(
      (resp: ResponseMessage) => {
        Swal.fire('Tudo certo!', resp.message, 'success')
        this.resetForms()
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Algo deu errado!', error.error.message, 'error')
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

    let integrantes = this.grupo.integrantes.filter(integrante => integrante.email)

    if (integrantes[0] && integrantes[0].email && !this.verificarEmail(integrantes[0].email)) {
      Swal.fire('Erro ao enviar formulário', 'Primeiro email inválido', 'error')
      return false
    }

    if (integrantes[1] && integrantes[1].email && !this.verificarEmail(integrantes[1].email)) {
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
