import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("filaConsultas")
class FilaConsultas {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    paciente_id: string;

    @Column()
    consulta_id: string;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { FilaConsultas }