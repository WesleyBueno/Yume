import { Grupo } from "./Grupo"

export class Usuario {

    public id!: number
    public nome !: string
    public email!: string
    public senha!: string
    public telefone!: string
    public cpf!: string
	public nascimento!: string
    public genero!: string
    public cidade!: string
    public estado!: string
    public instituicaoEnsino!: string
    public escolaridade!: string
    public grupo!: Grupo
    public ativo!: boolean
    public role!: string
    public token!: string

}