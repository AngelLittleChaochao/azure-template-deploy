# azure-template-deploy
using service application account to deploy resource

Sometimes we need to call Azure API in our service. Since the service mostly not your machine, and the service has many instances, you cannot login to every machine to use your own Azure account to call the API. In this scenario, Azure Service Application is your right choice.

## Create an Azure Application.
How to create? Read [this document].(https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md)

## Call Azure API
After you created your service application, you can have a try to call Azure API using this application account.

Learn more about [Azure Application].(https://azure.microsoft.com/en-us/documentation/articles/active-directory-application-objects/)
