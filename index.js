const eris = require("eris");
const cohere = require("cohere-ai");

cohere.init("gEWJ4sIt4Dnnc29jWWG17NcCOtlyBgl0vrqSjrd6");

const options = {
  method: "POST",
  url: "https://api.cohere.ai/v1/classify",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: "Bearer gEWJ4sIt4Dnnc29jWWG17NcCOtlyBgl0vrqSjrd6",
  },
  data: { truncate: "END" },
};


const examples = [
  { text: "you are hot trash", label: "Toxic" },
  { text: "go to hell", label: "Toxic" },
  { text: "get rekt moron", label: "Toxic" },
  { text: "get a brain and use it", label: "Toxic" },
  { text: "say what you mean, you jerk.", label: "Toxic" },
  { text: "Are you really this stupid", label: "Toxic" },
  { text: "I will honestly kill you", label: "Toxic" },
  { text: "yo how are you", label: "Benign" },
  { text: "I'm curious, how did that happen", label: "Benign" },
  { text: "Try that again", label: "Benign" },
  { text: "Hello everyone, excited to be here", label: "Benign" },
  { text: "I think I saw it first", label: "Benign" },
  { text: "That is an interesting point", label: "Benign" },
  { text: "I love this", label: "Benign" },
  { text: "We should try that sometime", label: "Benign" },
  { text: "You should go for it", label: "Benign" },
];

// Create a Client instance with bot token
const bot = new eris.Client(process.env.bot);

bot.on("ready", () => {
  console.log("Connected and ready.");
});

bot.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  const inputs = [msg.content];
  const res = await (async () => {
    const response = await cohere.classify({
      inputs: inputs,
      examples: examples,
    });
    return response.body.classifications[0];
  })();
  if (msg.content.includes(bot.user.mention)) {
    msg.channel.createMessage(
      "The message you sent was " +
        res.prediction +
        " with a confidence of " +
        res.confidence
    );
  } else if (res.prediction === "Toxic") {
    msg.channel.createMessage(msg.author.username + " Please be nice!");
  }
});

bot.on("error", (err) => {
  console.warn(err);
});

bot.connect();
