import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class criarFilaExames1618250828879 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "filaExames",
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
                            name: "exame_id",
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
                            name: "FKExame",
                            referencedTableName: "exames",
                            referencedColumnNames: ["id"],
                            columnNames: ["exame_id"],
                            onDelete: "CASCADE",
                            onUpdate: "CASCADE"
                        }
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("filaExames");
    }

}
