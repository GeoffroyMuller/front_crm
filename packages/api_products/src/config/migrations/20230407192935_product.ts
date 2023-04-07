import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("products", function (table) {
        table.increments('id')
        table.string('name')
        table.integer('idCompany') 
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
}

