const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const rules = require("./rules.json");
const fs = require("fs");
const { startServer } = require("./alive.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!rules") {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select")
          .setPlaceholder("قائمة القوانين")
          .addOptions(
            rules.map((rule) => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            })),
          ),
      );

      const embed = new MessageEmbed()
        .setColor("#f8ca3d")
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/1123664172396335220/1259495472452862003/Untitled-1_2.png?ex=66a2f650&is=66a1a4d0&hm=6126b39c1069158164c4d13918ba3ce7077848a9d4af7e7eeaecb8cd7e61b7ea&",
        )
        .setTitle("قوانين السيرفر")
        .setDescription(
          "**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**",
        )
        .setImage(
          "https://cdn.discordapp.com/attachments/1246348141238685797/1263702126169821205/background.png?ex=66a27211&is=66a12091&hm=618b63052e6f5fac407cbc499a9e6b3e3e8071e1b3c77c0eedfd50b313f5d7da&",
        )
        .setFooter({ text: "Rules Bot" })
        .setTimestamp();

      const sentMessage = await message.channel.send({
        embeds: [embed],
        components: [row],
      });
      await message.delete();
    } else {
      await message.reply({
        content: "You need to be an administrator to use this command.",
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find((r) => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, "utf-8");
    const ruleEmbed = new MessageEmbed()
      .setColor("#f8ca3d")
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: "Rules Bot" })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
