#! /usr/bin/env node

import chalk from "chalk";
import * as yargs from "yargs";
import { getUrl } from "../core";

(async () => {
  try {
    if (yargs.argv.help) {
      console.log(chalk.yellowBright("tsuml --glob ./src/**/*.ts"));
    }

    const pattern = yargs.argv.glob;

    if (!pattern) {
      console.log(chalk.redBright("Missing --glob"));
    } else {
      // const url = await getUrl(
      //   "/Users/xiong.li/Desktop/work/credit_fronted/risk_admin/credit_risk_admin_node/tsconfig.json",
      //   "/Users/xiong.li/Desktop/work/credit_fronted/risk_admin/credit_risk_admin_node/src/plugins/**/*.ts"
      // );
      const url = await getUrl(
        "/Users/xiong.li/Desktop/work/credit_fronted/risk_admin/credit_risk_admin/tsconfig.json",
        "/Users/xiong.li/Desktop/work/credit_fronted/risk_admin/credit_risk_admin/src/components/bpmn/**/*.*"
      );
      console.log(url);
      const opn = require("opn");
      opn(url);
    }
  } catch (e) {
    console.log(chalk.redBright(e));
  }
})();
