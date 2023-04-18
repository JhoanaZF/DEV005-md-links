import { mdLinks } from "..";
import fetch from "../__mocks__/node-fetch";
import {
  convertToAbsolutePath,
  extractDirectoryLinks,
  extractLinksFromHtml,
  getFileLinksInfo,
  getLinkInfo,
  readDirectoryAndExtractFilesMd,
} from "../myFunctions";
jest.mock("node-fetch");
describe("mdLinks", () => {
  it("Devuelve una lista de objetos que contengan las propiedades: href, text y file", () => {
    const options = { validate: false };
    const filePath = "./pruebas/subPruebas/texto1.md";
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      },
      {
        href: "https://www.freecodecamp.org/",
        text: "Prueba freeCodeCamp",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      },
    ];
    return mdLinks(filePath, options).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });

  it("Devuelve una lista de objetos que contengan las propiedades, href, text, file, status y ok.", () => {
    const options = { validate: true };
    const filePath = "./pruebas/subPruebas/texto1.md";
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
        status: 200,
        ok: "✅OK✅",
      },
      {
        href: "https://www.freecodecamp.org/",
        text: "Prueba freeCodeCamp",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
        status: 200,
        ok: "✅OK✅",
      },
    ];
    return mdLinks(filePath, options).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });

  it("Devuelve un error para un archivo que no existe", () => {
    return mdLinks("./pruebas/subPruebas/texto11.md", {
      validate: false,
    }).catch((error) => {
      expect(error.message).toEqual(
        "ENOENT: no such file or directory, stat './pruebas/subPruebas/texto11.md'"
      );
    });
  });

  it("Devuelve un error si la ruta no es un archivo o directorio válido", () => {
    const options = { validate: false };
    const invalidPath = "./pruebas/subPruebas/invalidPath";
    const expectedError = new Error(
      "The path must be a Markdown file or a directory."
    );
    return mdLinks(invalidPath, options).catch((error) => {
      expect(error).toEqual(expectedError);
    });
  });
});

describe("convertToAbsolutePath", () => {
  it("Convierte una ruta relativa en absoluta", () => {
    const relativePath = "./pruebas/subPruebas/texto1.md";
    const absolutePath = convertToAbsolutePath(relativePath);

    expect(absolutePath).toEqual(
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md"
    );
  });

  it("No convierte una ruta absoluta", () => {
    const absolutePath =
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md";
    const convertedPath = convertToAbsolutePath(absolutePath);

    expect(convertedPath).toEqual(
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md"
    );
  });
});

describe("extractLinksFromHtml", () => {
  it("Extrae los enlaces de un archivo Markdown simple", () => {
    const markdown =
      "[Prueba Youtube](https://www.youtube.com/watch?v=_fxCy2yCIgQ)";
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
      },
    ];
    expect(extractLinksFromHtml(markdown)).toEqual(expectedLinks);
  });

  it("Extrae los enlaces de un archivo Markdown con varios enlaces", () => {
    const markdown = `
  [Prueba Youtube](https://www.youtube.com/watch?v=_fxCy2yCIgQ)
  [Prueba freeCodeCamp](https://www.freecodecamp.org/)

  `;
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
      },
      { href: "https://www.freecodecamp.org/", text: "Prueba freeCodeCamp" },
    ];
    expect(extractLinksFromHtml(markdown)).toEqual(expectedLinks);
  });

  it("Extrae los enlaces de un archivo Markdown con enlaces sin texto", () => {
    const markdown = `
  [](https://www.youtube.com/watch?v=_fxCy2yCIgQ)
  [Prueba freeCodeCamp](https://www.freecodecamp.org/)
  `;
    const expectedLinks = [
      { href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ", text: "" },
      { href: "https://www.freecodecamp.org/", text: "Prueba freeCodeCamp" },
    ];
    expect(extractLinksFromHtml(markdown)).toEqual(expectedLinks);
  });
});

describe("getFileLinksInfo", () => {
  it("Obtiene los links de un archivo markdown y validar su estado", () => {
    const options = { validate: true };
    const filePath =
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md";
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
        status: 200,
        ok: "✅OK✅",
      },
      {
        href: "https://www.freecodecamp.org/",
        text: "Prueba freeCodeCamp",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
        status: 200,
        ok: "✅OK✅",
      },
    ];

    getFileLinksInfo(filePath, options).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });

  it("Obtiene los links de un archivo markdown sin validar su estado", () => {
    const options = { validate: false };
    const filePath =
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md";
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      },
      {
        href: "https://www.freecodecamp.org/",
        text: "Prueba freeCodeCamp",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      },
    ];

    getFileLinksInfo(filePath, options).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });
});

describe("readDirectoryAndExtractFilesMd", () => {
  it("Extrae todos los archivos con extensión .md del directorio indicado", () => {
    const filePathDir =
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas";
    const expectedLinks = [
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\texto2.md",
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\texto3.md",
    ];

    expect(readDirectoryAndExtractFilesMd(filePathDir)).toEqual(expectedLinks);
  });
});

describe("extractDirectoryLinks", () => {
  it("Obtiene los links de todos los archivos markdown en un directorio y sus subdirectorios sin validar su estado", () => {
    const options = { validate: false };
    const filePathDir =
      "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas";
    const expectedLinks = [
      {
        href: "https://www.youtube.com/watch?v=_fxCy2yCIgQ",
        text: "Prueba Youtube",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      },
      {
        href: "https://www.freecodecamp.org/",
        text: "Prueba freeCodeCamp",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\subPruebas\\texto1.md",
      },
      {
        href: "https://github.com/Labsdsforatoria/DEV005-data-lovers",
        text: "Prueba Data Lovers",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\texto2.md",
      },
      {
        href: "https://github.com/Laboratoria/DEV005-cipher",
        text: "Prueba Cipher",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\texto2.md",
      },
      {
        href: "https://github.com/Laboratoria/dev005-trivia",
        text: "Prueba Trivia",
        file: "C:\\Users\\PC-JHOANA\\Desktop\\PROYECTOS\\LABORATORIA\\DEV005-md-links\\pruebas\\texto2.md",
      },
    ];

    return extractDirectoryLinks(filePathDir, options).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });
});

describe("getLinkInfo", () => {
  it("Obtiene un arreglo con objetos de enlaces que contienen propiedades href, text y file", () => {
    const linkArray = [
      {
        href: "https://github.com/Laboratoria/DEV005-cipher",
        text: "Prueba Cipher",
      },
      {
        href: "https://github.com/Laboratoria/dev005-trivia",
        text: "Prueba Trivia",
      },
    ];
    const filePath = "texto2.md";
    const options = { validate: false };
    const expectedOutput = [
      {
        href: "https://github.com/Laboratoria/DEV005-cipher",
        text: "Prueba Cipher",
        file: "texto2.md",
      },
      {
        href: "https://github.com/Laboratoria/dev005-trivia",
        text: "Prueba Trivia",
        file: "texto2.md",
      },
    ];

    const result = getLinkInfo(linkArray, filePath, options);
    expect(result).toEqual(expectedOutput);
  });
});

it("Obtiene un arreglo con objetos de enlaces que contienen propiedades href, text, file, status y ok", () => {
  const filePath = "texto2.md";
  const linkArray = [
    {
      href: "https://github.com/Laboratoria/DEV005-cipher",
      text: "Prueba Cipher",
    },
    {
      href: "https://github.com/Labsdsforatoria/DEV005-data-lovers",
      text: "Fake link",
    },
  ];
  const options = { validate: true };
  const expectedOutput = [
    {
      file: "texto2.md",
      href: "https://github.com/Laboratoria/DEV005-cipher",
      text: "Prueba Cipher",
      status: 200,
      ok: "✅OK✅",
    },
    {
      file: "texto2.md",
      href: "https://github.com/Labsdsforatoria/DEV005-data-lovers",
      text: "Fake link",
      status: 404,
      ok: "❌FAIL❌",
    },
  ];

  fetch.mockImplementation((url) => {
    if (url === "https://github.com/Laboratoria/DEV005-cipher") {
      return Promise.resolve({ status: 200 });
    } else if (
      url === "https://github.com/Labsdsforatoria/DEV005-data-lovers"
    ) {
      return Promise.resolve({ status: 404 });
    } else {
      throw new Error(`Unexpected URL: ${url}`);
    }
  });

  return getLinkInfo(linkArray, filePath, options).then((result) => {
    expect(result).toEqual(expectedOutput);
  });
});
