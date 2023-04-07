import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reservations", function (table) {
    table.increments("id");
    table.integer("idCompany");
    table.integer("idClient");
    table.string("clientName", 255);
    table.text("description");
    table.datetime("dtstart");
    table.datetime("dtend");
    table.datetime("created_at").defaultTo(knex.fn.now());
  });
  await knex.schema.createTable("reservation_lines", function (table) {
    table.increments("id");

    table.integer("idReservation");

    table.integer("idProduct");
    table.integer("idVat");

    table.text("description");
    table.float("qty");
    table.float("unit_price");
    table.float("discount");
    table.string("discount_type"); // € ou %
    table.string("type"); // title | product | comment | discount
    table.integer("order");
  });
  await knex.schema.createTable("reservation_sublines", function (table) {
    table.increments("id");
    table.integer("idLine");
    table.integer("idProductReal");
  });
  return;
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("reservations");
  await knex.schema.dropTable("reservation_lines");
  await knex.schema.dropTable("reservation_sublines");
  return;
}
