// const shell = require('shelljs');
// const chalk = require('chalk');
// const path = require('path');
// const fs = require('fs');
//
// shell.echo('Switching JointJS from joint to joint.core...');
//
// const JOINT_PACKAGE_JSON_FILE = path.join('node_modules', 'jointjs', 'package.json');
//
// if (!fs.existsSync(JOINT_PACKAGE_JSON_FILE)) {
//   const errorMsg = `File ${JOINT_PACKAGE_JSON_FILE} does not exist!`;
//   shell.echo(chalk.red(errorMsg));
//   throw new Error(errorMsg);
// }
//
// const json = JSON.parse(fs.readFileSync(JOINT_PACKAGE_JSON_FILE));
//
// if (typeof json['main'] === 'string') {
//   const replacementMain = json['main'].replace(`joint.min.js`, 'joint.core.min.js');
//   const replacementStyle = json['style'].replace(`joint.min.css`, 'joint.core.min.css');
//   if (replacementMain !== json['main'] || replacementStyle !== json['style']) {
//     json['main'] = replacementMain;
//     json['style'] = replacementStyle;
//     fs.writeFileSync(JOINT_PACKAGE_JSON_FILE, JSON.stringify(json, null, 2));
//     shell.echo(chalk.green(`Successfully replaced joint with joint.core in ${JOINT_PACKAGE_JSON_FILE}`));
//   } else {
//     shell.echo(chalk.green(`Already switched to joint.core in ${JOINT_PACKAGE_JSON_FILE}`));
//   }
// } else {
//   shell.echo(chalk.red(`No 'main' property found in ${JOINT_PACKAGE_JSON_FILE}`));
// }

