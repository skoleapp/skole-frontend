/// <reference types="cypress" />

import coverageTask from '@cypress/code-coverage/task';
import { readdirSync } from 'fs';

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  coverageTask(on, config);

  on('task', {
    readdir(path) {
      return readdirSync(path);
    },
  });

  return config;
};

export default pluginConfig;
