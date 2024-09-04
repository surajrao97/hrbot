# hrbot

HR process automate

This bot has been created using [Bot Framework](https://dev.botframework.com), it shows how to create a simple bot that accepts input from the user and echoes it back.

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

  ```bash
  # determine node version
  node --version
  ```

## To run the bot

- Install modules

  ```bash
  npm install
  ```

- Start the bot

  ```bash
  npm start
  ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.9.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- [Gathering Input Using Prompts](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal](https://portal.azure.com)
- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Restify](https://www.npmjs.com/package/restify)
- [dotenv](https://www.npmjs.com/package/dotenv)

deploysteps:
az deployment group create —g "rrchatbotgroup" —-template-file "./template-BotApp-new-rg.json" —-location "westus" —-parameters appId="4e1ab2e0-89c1-4668-8413-ff25f10c6f3d" appSecret="Password@1234" botId="rrchatbot" botSku=F0 newAppServicePlanName="rrchatbot" newWebAppName="rrchatbot" groupName="rrchatbot" groupLocation="westus" newAppServicePlanLocation="westus" —-name "rrchatbot"

Steps to deploy:

1. az login
2. az account set --subscription "<subscription>" (For <subscription>, use the ID or name of the subscription to use.)
3. az group create --name "<group>" --location "<region>"

4. az ad app create --display-name "<app-registration-display-name>" --sign-in-audience "AzureADandPersonalMicrosoftAccount"

5. az ad app credential reset --id "<appId>" (command to generate a new password for your app registration.)

6. Record values you'll need in later steps: the app ID and password from the command output.

7. az deployment group create --resource-group <resource-group> --template-file <template-file-path> --parameters "@<parameters-file-path>"

8. az bot prepare-deploy --lang Javascript --code-dir "."

9. Zip all the files in code directory

10. az webapp deploy --resource-group <myResourceGroup> --name <myUniqueAppName> --src-path /path/to/your/chatbot/project.zip --type zip
