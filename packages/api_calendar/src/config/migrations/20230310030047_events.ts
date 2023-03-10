import { Knex } from "knex";

const tableName = "events";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id");
    table.datetime("dtstamp");
    table.datetime("dtstart");
    table.datetime("dtend");
    table.string("summary");
    table.string("description");
    table.string("location");
    table.string("recurrence_freq");
    table.integer("recurrence_interval");
    table.integer("recurrence_count");
    table.string("recurrence_until");

    table.integer('idProduct')
    table.integer("idCompany");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
