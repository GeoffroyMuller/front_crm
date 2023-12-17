import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products_images", function (table) {
    table.increments("id");
    table.integer("idMedia");
    table.integer("idProduct");
    table.string("filepath");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products_images");
}
