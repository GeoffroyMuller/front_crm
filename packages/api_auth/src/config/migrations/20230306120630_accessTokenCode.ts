import { Knex } from "knex";


const tableName = "users"


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(tableName, (table) => {
        table.string('accessTokenCode', 255)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('accessTokenCode')
    })
}

