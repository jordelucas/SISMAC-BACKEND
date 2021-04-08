import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("vagasConsultas")
class VagaConsultas {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    nomeEspecialista: string;

    @CreateDateColumn()
    dataConsulta: Date;

    @Column()
    quantidade: number;

    @Column()
    local: string;

    @Column()
    consulta_id: string;


    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { VagaConsultas }