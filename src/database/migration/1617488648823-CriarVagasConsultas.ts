import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriarVagasConsultas1617488648823 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "vagasConsultas",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "nomeEspecialista",
                            type: "varchar"
                        },
                        {
                            name: "dataConsulta",
                            type: "Date"
                        },
                        {
                            name: "quantidade",
                            type: "int"
                        },
                        {
                            name: "consulta_id",
                            type: "uuid"
                        }
                    ],
                    foreignKeys: [
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
        await queryRunner.dropTable("vagasConsultas");
    }

}
