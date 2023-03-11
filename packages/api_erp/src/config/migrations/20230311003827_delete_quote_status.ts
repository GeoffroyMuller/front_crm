import { Knex } from "knex";

const tableName = "quotes";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn("status");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.string("status");
  });
}
