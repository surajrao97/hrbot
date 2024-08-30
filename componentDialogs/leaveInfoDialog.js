const { MessageFactory } = require("botbuilder");
const { WaterfallDialog, ComponentDialog } = require("botbuilder-dialogs");
const { ConfirmPrompt, DateTimePrompt } = require("botbuilder-dialogs");
const { DialogSet, DialogTurnStatus } = require("botbuilder-dialogs");

const CONFIRM_PROMPT = "CONFIRM_PROMPT";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
const DATETIME_PROMPT = "DATETIME_PROMPT";
var endDialog = "";

class LeaveInfoDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super("leaveInfoDialog");
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
    this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.firstStep.bind(this),
        this.getConfirmation.bind(this),
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
    var reply = MessageFactory.suggestedActions(
      ["Apply Leave", "Leave Balance", "Leave Status"],
      "Select one action."
    );
    return await step.context.sendActivity(reply);
  }

  async getConfirmation(step) {
    step.values.leaveaction = step.result;
    if (step.values.leaveaction === "Apply Leave") {
      return await step.prompt(
        CONFIRM_PROMPT,
        "Are you sure you want to apply leave?",
        ["yes", "no"]
      );
    } else return await step.continueDialog();
  }

  async isDialogComplete() {
    return endDialog;
  }
}

module.exports.LeaveInfoDialog = LeaveInfoDialog;
