const { WaterfallDialog, ComponentDialog } = require("botbuilder-dialogs");
const { ConfirmPrompt } = require("botbuilder-dialogs");
const { DialogSet, DialogTurnStatus } = require("botbuilder-dialogs");

const CONFIRM_PROMPT = "CONFIRM_PROMPT";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
var endDialog = "";

class DocumentSubmissionDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super("documentSubmissionDialog");
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.firstStep.bind(this),
        this.getDocList.bind(this),
      ])
    );
    this.initialDialogId = WATERFALL_DIALOG;
  }

  async run(context, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);
    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async firstStep(step) {
    endDialog = false;
    return await step.prompt(
      CONFIRM_PROMPT,
      "Have you submitted all the documents?",
      ["yes", "no"]
    );
  }

  async getDocList(step) {
    if (step.result === false) {
      await step.context.sendActivity(
        "List of Documents:\n 1. Aadhaar card\n2. PAN card\n You can submit the documents via below URL:https://wipro.com"
      );
      endDialog = true;
      return await step.endDialog();
    } else {
      await step.context.sendActivity("Thank you for submitting documents.");
      endDialog = true;
      return await step.endDialog();
    }
  }

  async isDialogComplete() {
    return endDialog;
  }
}

module.exports.DocumentSubmissionDialog = DocumentSubmissionDialog;
