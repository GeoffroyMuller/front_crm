import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTable("products");
  await knex.schema.dropTable("products_real");
  await knex.schema.dropTable("product_fields");
  await knex.schema.dropTable("product_real_fields");
  await knex.schema.dropTable("product_real_out");
  return;
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", function (table) {
    table.increments("id");
    table.integer("idCompany");
    table.string("name", 255);
    table.text("description");
    table.float("price");
    table.float("stock");
    table.string("stockManagement");
    table.integer("capacity");
  });
  await knex.schema.createTable("products_real", function (table) {
    table.increments("id");
    table.integer("idProduct");
    table.string("reference");
  });
  await knex.schema.createTable("product_fields", function (table) {
    table.increments("id");
    table.integer("idProduct");
    table.string("name");
    table.string("type");
    table.json("props");
  });
  await knex.schema.createTable("product_real_fields", function (table) {
    table.increments("id");
    table.integer("idProductReal");
    table.integer("idProductField");
    table.json("value");
  });

  await knex.schema.createTable("product_real_out", function (table) {
    table.increments("id");
    table.integer("idCompany");
    table.integer("idProductReal");
    table.integer("idClient");
    table.integer("idReservation");
    table.datetime("dtstart");
    table.datetime("dtend");
  });
  return;
}
