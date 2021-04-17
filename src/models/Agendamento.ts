import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("agendamentos")
class Agendamento {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    paciente_id: string;

    @Column()
    vaga_id: string;

    @Column()
    type: string;


    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { Agendamento }