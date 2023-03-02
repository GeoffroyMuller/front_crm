import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTable("companies");
    await knex.schema.dropTable("users");
    return await knex.schema.dropTable("roles");
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.createTable("companies", function (table) {
        table.increments('id')
        table.string('name')
        table.integer('idCompany') 
    })
    await knex.schema.createTable('roles', function (table) {
        table.increments('id');
        table.string('name', 150);
        table.integer('idCompany');
        table.json('rights')
    });
    return await knex.schema.createTable('users', function (table) {
        table.increments('id')
        table.integer('idCompany')
        table.string('firstname')
        table.string('lastname')
        table.string('address')
        table.string('phone')
        table.string('email')
        table.string('password', 255)
        table.integer('idRole')
    })
}

