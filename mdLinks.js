import chalk from "chalk";
import {
  convertToAbsolutePath,
  extractLinksFromHtml,
  getLinkInfo,
  readDirectoryAndExtractFilesMd,
  getFileLinksInfo,
  extractDirectoryLinks,
} from "./myFuncions.js";
import { promises as fs } from "fs";
import path from "path";
/* Función que recibe como argumento la ruta de un archivo o directorio después se extraen los enlaces en el archivo Markdown, 
si es un directorio ejecuta la función extractDirectoryLinks */
const mdLinks = (paths, options) => {
  const absolutePath = convertToAbsolutePath(paths);
  return fs
    .stat(absolutePath)
    .then((pathStats) => {
      if (pathStats.isDirectory()) {
        return extractDirectoryLinks(absolutePath, options);
      } else if (pathStats.isFile() && path.extname(absolutePath) === ".md") {
        return getFileLinksInfo(absolutePath, options);
      } else {
        throw new Error(
          chalk.red.italic(`The path must be a Markdown file or a directory.`)
        );
      }
    })
    .catch((error) => {
      console.log(chalk.red.italic(error));
      return null;
    });
};

mdLinks("./pruebas", {
  validate: true,
}).then((links) => {
  console.log(links);
});
