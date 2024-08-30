const { MessageFactory } = require("botbuilder");
const {
  WaterfallDialog,
  ComponentDialog,
  Dialog,
} = require("botbuilder-dialogs");
const { ConfirmPrompt, DateTimePrompt } = require("botbuilder-dialogs");
const { DialogSet, DialogTurnStatus } = require("botbuilder-dialogs");

const CONFIRM_PROMPT = "CONFIRM_PROMPT";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
const WATERFALL_DIALOG2 = "WATERFALL_DIALOG2";
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
        this.applyLeave.bind(this),
        this.leaveConfirmation.bind(this),
      ])
    );
    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG2, [
        this.leaveBalance.bind(this),
        this.confirmBalance.bind(this),
        this.userInputForBalance.bind(this),
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
    await step.context.sendActivity(reply);
    return Dialog.EndOfTurn;
  }

  async getConfirmation(step) {
    step.values.leaveaction = step.result;
    if (step.values.leaveaction === "Apply Leave") {
      return await step.prompt(
        CONFIRM_PROMPT,
        "Are you sure you want to apply leave?",
        ["yes", "no"]
      );
    } else if (step.values.leaveaction === "Leave Balance") {
      step.beginDialog(WATERFALL_DIALOG2);
    } else return await step.next();
  }

  async applyLeave(step) {
    if (step.result === true) {
      return await step.prompt(DATETIME_PROMPT, "Enter date for PTO");
    } else {
      await step.context.sendActivity("You chose not to apply leave");
      endDialog = true;
      return await step.endDialog();
    }
  }

  async leaveConfirmation(step) {
    step.values.leavedate = step.result;
    await step.context.sendActivity(
      `PTO request sent for approval for date ${step.values.leavedate}`
    );
    endDialog = true;
    return await step.endDialog();
  }

  async leaveBalance(step) {
    await step.context.sendActivity(`Your remaining Leave balance is: 2`);
    return await step.next();
  }

  async confirmBalance(step) {
    return await step.prompt(CONFIRM_PROMPT, "Confirm your balance.", [
      "yes",
      "no",
    ]);
  }

  async userInputForBalance(step) {
    if (step.result === true) {
      endDialog = true;
      return await step.endDialog();
    } else {
      await step.context.sendActivity(
        "We will look into the issue with balance."
      );
      return await step.endDialog();
    }
  }

  async isDialogComplete() {
    return endDialog;
  }
}

module.exports.LeaveInfoDialog = LeaveInfoDialog;
