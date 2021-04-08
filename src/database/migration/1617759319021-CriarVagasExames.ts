import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriarVagasExames1617759319021 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "vagasExames",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "dataExame",
                            type: "Date"
                        },
                        {
                            name: "quantidade",
                            type: "int"
                        },
                        {
                            name: "local",
                            type: "varchar"
                        },
                        {
                            name: "exame_id",
                            type: "uuid"
                        }
                    ],
                    foreignKeys: [
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
        await queryRunner.dropTable("vagasExames");
    }

}
