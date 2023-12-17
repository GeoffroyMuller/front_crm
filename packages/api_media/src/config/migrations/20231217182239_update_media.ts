import { Knex } from "knex";

const tableName = "medias";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.integer("id_model");
    table.string("model", 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn("id_model");
    table.dropColumn("model");
  });
}
