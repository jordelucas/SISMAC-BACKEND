import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("vagasExames")
class VagaExames {
    @PrimaryColumn()
    readonly id: string;

    @CreateDateColumn()
    dataExame: Date;

    @Column()
    quantidade: number;

    @Column()
    exame_id: string;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { VagaExames }