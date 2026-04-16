import { CalculationEntry } from "./historyService";

export const slackService = {
  /**
   * Send a formatted calculation history summary to Slack
   */
  async sendCalculationHistory(webhookUrl: string, data: CalculationEntry[]) {
    if (!webhookUrl) throw new Error("Slack Webhook URL is not configured");
    if (data.length === 0) throw new Error("No history data to send");

    const recentItems = data.slice(0, 5); // Send top 5 most recent
    
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📊 Tokensense AI - Recent Calculations",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Here is a summary of your last *${recentItems.length}* calculations:`
        }
      },
      {
        type: "divider"
      }
    ];

    recentItems.forEach((entry) => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${entry.modelName}*\n• Tokens: ${entry.totalTokens.toLocaleString()}\n• Cost: *$${entry.totalCost.toFixed(4)}*\n• _"${entry.promptSnippet.substring(0, 50)}..."_`
        }
      } as any);
    });

    blocks.push({
      type: "divider"
    });

    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Sent from Tokensense AI • ${new Date().toLocaleString()}`
        }
      ]
    } as any);

    return this.postToSlack(webhookUrl, { blocks });
  },

  /**
   * Send a budget alert notification to Slack
   */
  async sendBudgetAlert(webhookUrl: string, budgetData: {
    budget: number,
    projected: number,
    modelName: string,
    dailyVolume: number
  }) {
    if (!webhookUrl) throw new Error("Slack Webhook URL is not configured");

    const overage = budgetData.projected - budgetData.budget;
    
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⚠️ Tokensense AI - Budget Alert",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Warning:* Your projected monthly spend for *${budgetData.modelName}* has exceeded your set budget.`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Monthly Budget:*\n$${budgetData.budget}`
          },
          {
            type: "mrkdwn",
            text: `*Projected Spend:*\n$${budgetData.projected.toFixed(2)}`
          },
          {
            type: "mrkdwn",
            text: `*Daily Volume:*\n${budgetData.dailyVolume.toLocaleString()} requests`
          },
          {
            type: "mrkdwn",
            text: `*Overage:*\n:red_circle: $${overage.toFixed(2)}`
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Review Budget",
              emoji: true
            },
            url: "https://www.tokensense-ai.com/#budget-planner",
            style: "primary"
          }
        ]
      }
    ];

    return this.postToSlack(webhookUrl, { blocks });
  },

  /**
   * Core method to post to Slack webhook
   */
  async postToSlack(webhookUrl: string, payload: any) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors", // Webhooks often don't support CORS from browser
      });
      
      // With mode 'no-cors', we can't see the response body or status.
      // However, it's the only way to send a POST to a different origin from a browser 
      // without server-side proxy if the target (Slack) doesn't have CORS enabled for our domain.
      return { success: true };
    } catch (error) {
      console.error("Slack POST Error:", error);
      throw error;
    }
  }
};
