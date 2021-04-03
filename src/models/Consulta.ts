import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("consultas")
class Consulta {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    nome: string;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { Consulta }