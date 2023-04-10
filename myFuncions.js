// Importacion de los modulos
import chalk from "chalk";
import Cheerio from "cheerio";
import { promises as fs, readdirSync, statSync } from "fs";
import { marked } from "marked";
import fetch from "node-fetch";
import path from "path";

// Función que verifica si la ruta es absoluta y si no la convierte.
const convertToAbsolutePath = (paths) => {
  if (path.isAbsolute(paths)) {
    return paths;
  } else {
    return path.resolve(paths);
  }
};

// Función para convertir el contenido Markdown a HTML y analizar el HTML y extraer los enlaces en un arreglo de objetos.
const extractLinksFromHtml = (contentMarkdown) => {
  const convertedHtml = marked(contentMarkdown);
  const cheerioContent = Cheerio.load(convertedHtml);
  const extractedLinks = cheerioContent("a")
    .map((index, link) => {
      const href = cheerioContent(link).attr("href");
      const text = cheerioContent(link).text();
      return { href, text };
    })
    .toArray();
  return extractedLinks;
};

// Función que hace validación de los links.
const getLinkInfo = (array, filePath, options) => {
  if (!options.validate) {
    return array.map((link) => ({
      href: link.href,
      text: link.text,
      file: filePath,
    }));
  } else {
    const linkInfoArray = array.map((link) =>
      fetch(link.href).then((linkResponse) => ({
        href: link.href,
        text: link.text,
        file: filePath,
        status: linkResponse.status,
        ok: linkResponse.status === 200 ? "✅OK✅" : "❌FAIL❌",
      }))
    );
    return Promise.all(linkInfoArray);
  }
};

// Función que lee el contenido de archivo .md, extrae los enlaces para obtener información detallada de los enlaces.
const getFileLinksInfo = (filePath, options) => {
  return fs
    .readFile(filePath, "utf-8")
    .then((contentMarkdown) => {
      const extractedLinks = extractLinksFromHtml(contentMarkdown);
      return getLinkInfo(extractedLinks, filePath, options);
    })
    .catch((error) => {
      chalk.red.italic(`The path or file is invalid.`);
    });
};

// Función que lee un directorio y busca archivos con extensión .md.
const readDirectoryAndExtractFilesMd = (paths) => {
  let newArray = [];
  let subDirectories = [];
  let array = readdirSync(paths);
  array.forEach((item) => {
    const newPath = path.resolve(paths, item);
    if (path.extname(newPath) === ".md") {
      newArray.push(newPath);
    } else if (statSync(newPath).isDirectory()) {
      subDirectories = readDirectoryAndExtractFilesMd(newPath);
      if (subDirectories.length > 0) {
        newArray.push(...subDirectories);
      }
    }
  });
  return newArray;
};

// Función que extrae los links de un directorio.
const extractDirectoryLinks = (directoryPath, options) => {
  const array = readDirectoryAndExtractFilesMd(directoryPath);
  const arrayLinks = array.map((link) => getFileLinksInfo(link, options));
  return Promise.all(arrayLinks).then((arrayOfArrays) => {
    const flatArray = arrayOfArrays.reduce(
      (accumulator, currentArray) => [...accumulator, ...currentArray],
      []
    );
    return flatArray;
  });
};

export {
  convertToAbsolutePath,
  extractLinksFromHtml,
  getLinkInfo,
  readDirectoryAndExtractFilesMd,
  getFileLinksInfo,
  extractDirectoryLinks,
};
