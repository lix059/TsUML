import * as fs from "fs";
import chalk from "chalk";
import { flatten, join } from "lodash";
import { findFilesByGlob, download } from "./io";
import {
  getAst,
  parseClasses,
  parseInterfaces,
  parseHeritageClauses,
} from "./parser";
import {
  emitSingleClass,
  emitSingleInterface,
  emitHeritageClauses,
} from "./emitter";

async function getDsl(tsConfigPath: string, pattern: string) {
  const sourceFilesPaths = await findFilesByGlob(pattern);

  console.log(
    chalk.yellowBright(
      "Matched files:\n" + sourceFilesPaths.reduce((p, c) => `${p}${c}\n`, "")
    )
  );

  const ast = getAst(tsConfigPath, sourceFilesPaths);
  let files = ast.getSourceFiles();

  files = files.filter((f) => {
    return !f.getFilePath().endsWith("test.ts");
    // && f.getFilePath().endsWith("AbstractVisitor.ts")
  });
  // parser
  const declarations = files.map((f) => {
    const classes = f.getClasses();
    const interfaces = f.getInterfaces();
    const path = f.getFilePath();
    // console.log(
    //   "classes ====>",
    //   classes,
    //   classes.map((o) => {
    //     console.log(o.isAbstract());
    //   })
    // );
    // console.log("declarations =====>", {
    //   fileName: path,
    //   classes: classes.map(parseClasses),
    //   heritageClauses: classes.map(parseHeritageClauses),
    //   interfaces: interfaces.map(parseInterfaces),
    // });
    return {
      fileName: path,
      classes: classes.map(parseClasses),
      heritageClauses: classes.map(parseHeritageClauses),
      interfaces: interfaces.map(parseInterfaces),
    };
  });

  // emitter
  const entities = declarations.map((d) => {
    // console.log(
    //   "declarations ======>",
    //   d.classes,
    //   d.interfaces,
    //   d.heritageClauses
    // );
    const classes = d.classes.map((c) =>
      emitSingleClass(c.className, c.properties, c.methods, c.isAbstract)
    );
    const interfaces = d.interfaces.map((i) =>
      emitSingleInterface(i.interfaceName, i.properties, i.methods)
    );
    if (d.heritageClauses[0] && d.heritageClauses[0].length > 0) {
      d.heritageClauses[0][0].className = d.classes[0].className;
    }
    const heritageClauses = d.heritageClauses.map(emitHeritageClauses);
    return [...heritageClauses, ...classes, ...interfaces];
  });

  return join(flatten(entities), "\n");
}

export async function getUrl(tsConfigPath: string, pattern: string) {
  const dsl = await getDsl(tsConfigPath, pattern);
  console.log("dsl ===>\n", dsl);
  return await download(dsl);
}
