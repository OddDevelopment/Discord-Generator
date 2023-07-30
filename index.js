const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const prettyMs = require("pretty-ms");
const { QuickDB } = require("quick.db");
const { getRandomFromArray } = require("./random.js");
const { cooldown, sendChannel, token, embed, buttons } = require("./config.json");

const db = new QuickDB();

const client = new Client({ intents: [] });

client.on("ready", async () => {
  console.log(`Bot ${client.user.username} is ready`);
  
  if (sendChannel) {
    let channel;

    try {
      channel = await client.channels.fetch(sendChannel);
    } catch {
      throw new Error(`Channel with ID ${sendChannel} not found`);
    }

    channel?.send({
      embeds: [
        EmbedBuilder.from(embed)
      ],
      components: [
        new ActionRowBuilder()
          .addComponents(
            buttons.map(button =>
              new ButtonBuilder()
                .setLabel(button.label)
                .setCustomId(button.id)
                .setStyle(ButtonStyle.Primary)
            )
          )
      ]
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  
  const userData = await db.get(`user_${interaction.user.id}`) ?? {};
  const waitFor = (
    userData.lastClicked ?
    Math.max(cooldown - (Date.now() - userData.lastClicked), 0) :
    0
  );
  if (waitFor > 0) return await interaction.reply({
    content: `You've already clicked a button recently! Please wait **${prettyMs(waitFor, { unitCount: 2 })}** before clicking one again.`,
    ephemeral: true
  });
  
  const button = buttons.find(button => button.id === interaction.customId);
  if (!button) return;

  userData.lastClicked = Date.now();
  await db.set(`user_${interaction.user.id}`, userData);
  
  const { responses } = button;

  await interaction.reply({
    content: getRandomFromArray(responses),
    ephemeral: true
  });
});

client.login(token);