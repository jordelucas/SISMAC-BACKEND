import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Paciente } from "./Paciente";

@Entity("agendamentos")
class Agendamento {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    paciente_id: string;

    @ManyToOne(() => Paciente)
    @JoinColumn({name: "paciente_id"})
    paciente: Paciente

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