'use strict';

const fs = require('fs');
const path = require('path');

const BbPromise = require('bluebird');

module.exports = {
  createDeployment() {
    return BbPromise.bind(this).then(this.checkForExistingDeployment).then(this.createIfNotExists);
  },

  checkForExistingDeployment() {
    const params = {
      project: this.serverless.service.provider.project,
    };

    return this.provider
      .request('deploymentmanager', 'deployments', 'list', params)
      .then((response) => {
        let foundDeployment;

        if (response && response.deployments) {
          foundDeployment = response.deployments.find((deployment) => {
            const name = `sls-${this.serverless.service.service}-${this.options.stage}`;
            return deployment.name === name;
          });
        }
        this.serverless.cli.log(`Found deployment: ${JSON.stringify(foundDeployment, null, 4)}`);
        return foundDeployment;
      });
  },

  createIfNotExists(foundDeployment) {
    if (foundDeployment) return BbPromise.resolve();

    this.serverless.cli.log('Creating deployment...');

    const filePath = path.join(
      this.serverless.config.servicePath,
      '.serverless',
      'configuration-template-create.yml'
    );

    const deploymentName = `sls-${this.serverless.service.service}-${this.options.stage}`;

    const params = {
      project: this.serverless.service.provider.project,
      resource: {
        name: deploymentName,
        target: {
          config: {
            content: fs.readFileSync(filePath).toString(),
          },
        },
      },
    };

    this.serverless.cli.log(`Creating deployment with Params: ${JSON.stringify(params, null, 4)}`);

    return this.provider
      .request('deploymentmanager', 'deployments', 'insert', params)
      .then(() => this.monitorDeployment(deploymentName, 'create', 5000));
  },
};
