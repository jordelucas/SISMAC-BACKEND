import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("exames")
class Exame {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    nome: string;

    @Column()
    autorizacao: boolean;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { Exame }