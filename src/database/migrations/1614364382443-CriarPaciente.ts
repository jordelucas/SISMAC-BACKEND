import { Column, MigrationInterface, QueryRunner, Table } from "typeorm";

export class CriarPaciente1614364382443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "pacientes",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "cpf",
                            type: "varchar"
                        },
                        {
                            name: "nsus",
                            type: "varchar"
                        },
                        {
                            name: "nome",
                            type: "varchar"
                        },
                        {
                            name: "cidade",
                            type: "varchar"
                        },
                        {
                            name: "bairro",
                            type: "varchar"
                        },
                        {
                            name: "numero",
                            type: "int"
                        },
                        {
                            name: "complemento",
                            type: "varchar"
                        },
                        {
                            name: "dtNascimento",
                            type: "Date"
                        },
                        {
                            name: "telefone",
                            type: "varchar"
                        }
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pacientes");
    }

}
