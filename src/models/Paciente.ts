import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("pacientes")
class Paciente {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    cpf: string;

    @Column()
    nsus: string;

    @Column()
    nome: string;

    @Column()
    cidade: string;

    @Column()
    bairro: string;

    @Column()
    numero: number;

    @Column()
    complemento: string;

    @CreateDateColumn()
    dtNascimento: Date;

    @Column()
    telefone: string;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { Paciente }