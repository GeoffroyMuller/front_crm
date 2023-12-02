import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("configuration", function (table) {
    table.increments("id");
    table.integer("idAuth");
    table.string("smtp_user", 255);
    table.string("smtp_pass", 255);
    table.string("smtp_host", 255);
    table.integer("smtp_distributor");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("configuration");
}
