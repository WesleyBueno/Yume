import { Usuario } from "./Usuario"

export class Grupo {

    public id!: string
    public nome!: string
    public integrantes!: Usuario[]
    public token!: string
}