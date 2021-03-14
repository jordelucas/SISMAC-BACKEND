import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriarExames1615742147335 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "exames",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "nome",
                            type: "varchar"
                        },
                        {
                            name: "autorizacao",
                            type: "boolean"
                        }
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("exames");
    }

}
