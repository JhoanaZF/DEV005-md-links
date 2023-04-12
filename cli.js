#!/usr/bin/env node
import chalk from "chalk";
import { mdLinks } from "./index.js";
import {
  calculateBrokenLinksStats,
  calculateLinksStats,
} from "./myFunctions.js";

console.log(
  chalk.rgb(
    48,
    207,
    208
  )(`
     MD-LINKS                                                                       
  `)
);
const path = process.argv[2];
const options = process.argv;
const validate = options.includes("--validate") ? true : false;
const stats = options.includes("--stats") ? true : false;
mdLinks(path, { validate: validate, stats: stats })
  .then((response) => {
    if (validate && stats) {
      return console.table(calculateBrokenLinksStats(response));
    } else if (stats) {
      const stats = calculateLinksStats(response);
      return console.table(stats);
    } else {
      return console.table(response);
    }
  })
  .catch((err) => console.log(err));
