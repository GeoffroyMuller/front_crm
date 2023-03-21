import { Knex } from "knex";

const tableName = "companies";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.string("address");
    table.string("city");
    table.string("zip_code");
    table.string("country");
    table.string("phone");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn("address");
    table.dropColumn("city");
    table.dropColumn("zip_code");
    table.dropColumn("country");
    table.dropColumn("phone");
  });
}
