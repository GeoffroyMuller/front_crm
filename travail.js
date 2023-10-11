const fs = require("fs");

const str = fs.readFileSync("travail").toString("utf8");
const rows = str.split("\n").filter((s) => s.length > 1);

/**
 *
 * Une ligne de nom contient "=="
 * un prix est ecrit  "(PRICE j)"
 */
const results = {};
let name = undefined;
let price = 0;
for (row of rows) {
  if (row.includes("==")) {
    if (name != undefined) {
      results[name] = price;
    }
    price = 0;
    name = row;
  }
  if (row.includes("(")) {
    price += Number(row.split("(")[1].split("j")[0]);
  }
}
if (name != undefined) {
  results[name] = price;
}

results["TOTAL"] = Object.keys(results)
  .map((k) => results[k])
  .reduce((prev, curr) => {
    return prev + curr;
  }, 0);
results["EQUILIBRE_JOUR_par_PERSONNE"] =
  results["TOTAL"] / Object.keys(results).length - 1;
console.log(results);
