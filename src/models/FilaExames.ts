import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("filaExames")
class FilaExames {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    paciente_id: string;

    @Column()
    exame_id: string;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { FilaExames }