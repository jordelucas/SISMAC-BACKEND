import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class criarFilaConsultas1618089577908 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "filaConsultas",
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
                            name: "consulta_id",
                            type: "uuid"
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
                        },
                        {
                            name: "FKConsulta",
                            referencedTableName: "consultas",
                            referencedColumnNames: ["id"],
                            columnNames: ["consulta_id"],
                            onDelete: "CASCADE",
                            onUpdate: "CASCADE"
                        }
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
