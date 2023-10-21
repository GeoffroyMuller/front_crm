import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("projects", function (table) {
    table.increments("id");
    table.integer("idCompany");
    table.string("name", 255);
    table.text("description");
  });
  await knex.schema.createTable("sections", function (table) {
    table.increments("id");
    table.string("name", 255);
    table.integer("idProject");
  });
  await knex.schema.createTable("tasks", function (table) {
    table.increments("id");
    table.string("name", 255);
    table.text("description");
    table.integer("idSection");
    table.integer("idProject");
    table.integer("idUser");
    table.boolean("completed").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("projects");
  await knex.schema.dropTable("sections");
  await knex.schema.dropTable("tasks");
}
