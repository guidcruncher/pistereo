import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  const log = new Logger('Configuration');
  let configFolder: string =
    process.env.NODE_CONFIG_DIR ?? path.join(process.cwd(), 'config');
  let configFile: string = path.join(configFolder, YAML_CONFIG_FILENAME);

  if (!fs.existsSync(configFile)) {
    configFolder = path.join(process.cwd(), 'config');
    configFile = path.join(configFolder, YAML_CONFIG_FILENAME);
  }

  if (!fs.existsSync(configFile)) {
    log.error('Cannot resd configurstion file : ' + configFile);
  }

  log.log('Reading configuration file : ' + configFile);

  return yaml.load(fs.readFileSync(configFile, 'utf8')) as Record<string, any>;
};
