/// <reference types="cypress" />
/// <reference types="node" />

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  return config;
};

export default pluginConfig;
