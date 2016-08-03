var msRestAzure = require('ms-rest-azure');
var resourceManagement = require("azure-arm-resource");
var fs = require('fs')
var bb = require('bluebird');


var subscribe_id = '<YourSubscribtionID>';
var domain = "<YourTenantID>"; // Your Tenant ID; In Azure CLI use commmand 'azure account show' to check
var clientId = "<YourServicePrinciplaName>";
var secret = "<YourServiceApplicationPassword>";

var groupName = 'MyGroupName', deployName = 'MyDeployment';

msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, function(err, credentials) {
    if (err) {
        console.info(err);
        return;
    }

    var client = new resourceManagement.ResourceManagementClient(credentials, subscribe_id);

    var groupParameters = {
        location: 'eastasia'
    };

    // data format please reference msdn document: https://msdn.microsoft.com/en-us/library/azure/dn790564.aspx
    var deployPara = {
        properties : {
            'template' : JSON.parse(fs.readFileSync('WindowsVirtualMachine.json', 'utf-8')),
            'parameters' : JSON.parse(fs.readFileSync('WindowsVirtualMachine.param.dev.json', 'utf-8')).parameters,
            mode : 'Complete'
        }
    }

    var group = bb.promisifyAll(client.resourceGroups, {multiArgs: boolean=true});
    var deploy = bb.promisifyAll(client.deployments, {multiArgs: boolean=true});

    group.createOrUpdateAsync(groupName, groupParameters)
    .then(function(data) {
        console.info(data[0]);
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            deploy.createOrUpdateAsync(groupName, deployName, deployPara)
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject(err);
            });
        })
    })
    .then(function(data) {
        // successfully create the deployment
        console.info(data[0]);
    })
    .catch(function(err) {
        console.info(err);
        console.log(err.stack);
    });
});
