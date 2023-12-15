import { Knex } from "knex";

const tableName = "medias";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id");
    table.string("filepath");
    table.string("filename");
    table.integer("idCompany");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
