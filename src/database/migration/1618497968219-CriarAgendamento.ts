import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriarAgendamento1618497968219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "agendamentos",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "paciente_id",
                            type: "uuid"
                        },
                        {
                            name: "id_vaga",
                            type: "uuid"
                        },
                        {
                            name: "type",
                            type: "varchar"
                        }
                    ],
                    foreignKeys: [
                        {
                            name: "FKPaciente",
                            referencedTableName: "pacientes",
                            referencedColumnNames: ["id"],
                            columnNames: ["paciente_id"],
                            onDelete: "CASCADE",
                            onUpdate: "CASCADE"
                        }
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("agendamentos");
    }

}
