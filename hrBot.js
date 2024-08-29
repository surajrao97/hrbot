const { ActivityHandler, MessageFactory } = require("botbuilder");
const {
  DocumentSubmissionDialog,
} = require("./componentDialogs/documentSubmissionDialog");

class HRBOT extends ActivityHandler {
  constructor(conversationState, userState) {
    super();
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialogState = conversationState.createProperty("dialogState");
    this.documentSubmissionDialog = new DocumentSubmissionDialog(
      this.conversationState,
      this.userState
    );
    this.previousIntent =
      this.conversationState.createProperty("previousIntent");
    this.conversationData =
      this.conversationState.createProperty("conversationData");
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      await this.dispatchToIntentAsync(context);
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onDialog(async (context, next) => {
      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      await this.sendWelcomeMessage(context);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }

  async sendWelcomeMessage(context) {
    const { activity } = context;
    for (const idx in activity.membersAdded) {
      if (activity.membersAdded[idx].id !== activity.recipient.id) {
        const welcomeMessage = `Welcome to Wipro Tech ${activity.membersAdded[idx].name}.`;
        await context.sendActivity(welcomeMessage);
        await this.sendSuggestedActions(context);
      }
    }
  }

  async sendSuggestedActions(context) {
    var reply = MessageFactory.suggestedActions(
      [
        "Document Submission",
        "First Day Information",
        "Laptop and Equipment",
        "Orientation Schedule",
      ],
      "Select any card to know more."
    );
    await context.sendActivity(reply);
  }

  async dispatchToIntentAsync(context) {
    var currentIntent = "";
    const previousIntent = await this.previousIntent.get(context, {});
    const conversationData = await this.conversationData.get(context, {});

    if (previousIntent.intentName && conversationData.endDialog === false) {
      currentIntent = previousIntent.intentName;
    } else if (
      previousIntent.intentName &&
      conversationData.endDialog === true
    ) {
      currentIntent = context.activity.text;
    } else {
      currentIntent = context.activity.text;
      await this.previousIntent.set(context, {
        intentName: context.activity.text,
      });
    }

    switch (currentIntent) {
      case "Document Submission":
        console.log("Inside Document Submission");
        await this.conversationData.set(context, { endDialog: false });
        await this.documentSubmissionDialog.run(context, this.dialogState);
        conversationData.endDialog =
          await this.documentSubmissionDialog.isDialogComplete();
        if (conversationData.endDialog) {
          await this.previousIntent.set(context, {
            intentName: null,
          });
          await this.sendSuggestedActions(context);
        }
        break;
      case "First Day Information":
        console.log("Inside First day info");
        await this.conversationData.set(context, { endDialog: false });
        await context.sendActivity(
          "Please arrive by 9:00 AM. Your first day will start with a brief orientation session."
        );
        await this.conversationData.set(context, { endDialog: true });
        await this.previousIntent.set(context, { intentName: null });
        await this.sendSuggestedActions(context);
        break;

      case "Laptop and Equipment":
        console.log("Inside Laptop and Equipment");
        await this.conversationData.set(context, { endDialog: false });
        await context.sendActivity(
          "our laptop will be handed to you during the orientation on your first day."
        );
        await this.conversationData.set(context, { endDialog: true });
        await this.previousIntent.set(context, { intentName: null });
        await this.sendSuggestedActions(context);
        break;

      case "Orientation Schedule":
        console.log("Inside Orientation");
        await this.conversationData.set(context, { endDialog: false });
        await context.sendActivity(
          "Here is your orientation schedule: [Link to Schedule]. You'll have sessions on company culture, team introductions, and tool training."
        );
        await this.conversationData.set(context, { endDialog: true });
        await this.previousIntent.set(context, { intentName: null });
        await this.sendSuggestedActions(context);
        break;
    }
  }
}

module.exports.HRBOT = HRBOT;
