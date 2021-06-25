//------------Discord.js--------------\\
const Discord = require("discord.js")
const config = require("./Config.json")

const bot = new Discord.Client()

//------------Modules--------------\\
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const dbdb = new FileSync("db.json")
const db = low(dbdb)
db.defaults({Infos_membres: []}).write()



const fs = require('fs');
const { get } = require("http");
const { measureMemory } = require("vm");
bot.commands = new Discord.Collection();

//const commandFiles = fs.readdirSync('./cmd/').filter(file => file.endsWith('.js'));
//for(const file of commandFiles){
    //const command = require(`./cmd/${file}`);   

    //bot.commands.set(command.name, command);
//}


//------------Connection--------------\\
bot.login(config.token)
bot.on("ready", async message => {
  bot.user.setActivity('Created by Kazuko#0069');
   // let guildW =  bot.guilds.cache.get(config.Wserverid)
   // let channelW =  bot.channels.cache.get(config.Wchannelid)
    //let rolew = bot.roles.cache.get(config.Wroleid) //let rolew = bot.roles.cache.get(config.Wroleid)
    //let lvlchannel = bot.channels.cache.get(config.channelidlvl)
    //let mutrole = bot.roles.cache.get(config.muterole)
    console.log(`Logged in as ${bot.user.tag}.`),
    console.log("Préfix = "+ config.prefix ),
    console.log("token = " + config.token)
    //console.log("Serveur = " + guildW.name)
    //console.log("Salon bienvenue/au revoir = " + channelW.name)
    //console.log("Autorole = " + rolew.name)
   // console.log("Channel Check level Up = " + lvlchannel.name)
    //console.log("mute role = " + mutrole.name)
    console.log("Je suis prêt !")
})
bot.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
	if (!channel) return;
	channel.send(`Welcome to the server, ${member}!`);
});




bot.setMaxListeners(5000)
//------------message--------------\\
bot.on("message", async message => {
  if(message.content === config.prefix+"lock") {
    if(message.member.hasPermission("ADMINISTRATOR")){
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
    message.channel.setName(`🔒 + ${message.channel.name}`)
    message.channel.send("Channel locked !")
    }else{
      message.reply("Vous n'avez pas la permission !")
    }
  }


  if(message.content === config.prefix+"unlock") {
    if(message.member.hasPermission("ADMINISTRATOR")){
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
    message.channel.send("Channel unlocked !")
    }else{
      message.reply("Vous n'avez pas la permission !")
    }
  }
  
  
  if(message.content.startsWith(config.prefix+"unmute")){
    if(message.member.hasPermission("ADMINISTRATOR")){
    let User = message.guild.member(message.mentions.users.first())
    if(User.roles.cache.has(config.muterole)){
      User.roles.remove(config.muterole)
      User.roles.add("805446205818667029")
      message.channel.send(User.displayName + " a bien été Unmute !")
    }
    }else message.channel.send("Vous n'avez pas la permission")
  }

  if(message.content.startsWith(config.prefix+"clear")){
    if(message.member.hasPermission("ADMINISTRATOR")){
    let dl = message.content.split(" ").slice(1)
    if(!dl || isNaN(dl) || dl < 1) return message.reply("Veuillez choisir un nombre entre 1 et 100")
    let dlf = Number(dl)
    message.channel.bulkDelete(dlf+1, true).then(message => message.channel.send(dlf + "message on été supprimé ")).catch(console.error)
    message.channel.send("message supprimé !")
  }else message.channel.send("Vous n'avez pas la permission")
}
  if(message.content.startsWith(config.prefix+"kick")){
    if(message.member.hasPermission("ADMINISTRATOR")){
    let User = message.mentions.users.array()[0]
    let reason = message.content.split(" ").slice(1).join(" ").slice(22)
    if(!reason || !User) return message.reply("Merci d'utiliser la syntaxe si contre (raison obligatoire) : !kick {UserMention} <Reason>")
    if(User.id === message.author.id) return message.reply("Vous ne pouvez pas vous auto-Kick ! ")


    message.channel.send(message.author.username + " Viens de kick " + User.username + " Raison: " + reason)
    message.guild.member(User).kick(reason)
    }else return message.channel.send("Tu n'a pas les permission de kick")
  }
  if (message.content == config.prefix+"invite"){
    let embed = new Discord.MessageEmbed()
    .setTitle("Invite Stixi bot")
    .addField(
      { name: 'Inviter le bot avec permission', value: '{Link}' },
      { name: 'inviter le bot sans permission', value: '{Link}' },
    )
  }
  if(message.content === config.prefix+"emping"){
    let embed = new Discord.MessageEmbed()
    .setDescription("**Pong ! :ping_pong: **")
    .setImage("https://www.denofgeek.com/wp-content/uploads/2020/06/Discord.png?fit=1244%2C696")
    .setColor("E4001B")
    message.channel.send(embed)
}
if(message.content === config.prefix+"rules"){
  message.channel.send("**Les seuls chose a respectée ici sont les règles du TOS de discord: ** https://discord.com/terms")
}
if(message.content === config.prefix+"soutien" || message.content  === "SOUTIEN"){
  message.channel.send("ALLEZ ON SOUTIENT LES GROS KK")
}
    if(message.content === config.prefix+"ping"){
      const embed = new Discord.MessageEmbed
      embed.setDescription('Pinging...')
      const msg = await message.channel.send(embed);
      const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; //verif edit
      const latency = `\`\`\`ini\n[${Math.floor(msg.createdTimestamp - timestamp)}ms ]\`\`\``;
      const apilatency = `\`\`\`ini\n[ ${Math.round(message.client.ws.ping)}ms]\`\`\``;
      embed.setTitle("Pong ! ")
      .addField('Latence', latency, true)
      .addField('Latence API', apilatency, true)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
      .setTimestamp();
      msg.edit(embed)

    }
    let msgid;

let nbMessageSpam = 3;
let idUserSpam = "";
bot.on("message", message => {
  if(message.author.id == idUserSpam){
    nbMessageSpam += 1;
    if(nbMessageSpam >= 10){
      message.reply("merci d'arreter de spam");
      nbMessageSpam = 0;
    }
  }else{
    idUserSpam = message.author.id;
    nbMessageSpam = 0;
  }
})

  
    
    if(message.content === config.prefix+"help"){
      let embed = new Discord.MessageEmbed()
      .setTitle("Menu d'aide de Sassy tools !")
      .setDescription("Commande de modération")
      .setImage("https://jamietalksanime.files.wordpress.com/2016/03/one-punch-man-16.gif")
      .setColor("000000")
      .addField("Ping", "Réponds Pong (latence)")
      .addField("Clear", " Clear des message (ADMIN)",)
      .addField("Lock", "Vérrouille un channel")
      .addField("Unlock", "dévérouille un channel")
      .setFooter("Page 1")
      let msg = await message.channel.send(embed)
      idmsg = msg.id
      await msg.react("1️⃣")
      await msg.react("2️⃣")
      
      let embed2 = new Discord.MessageEmbed()
    .setTitle("Menu d'aide de Sassy tools !")
    .setDescription("Fun commande")
    .setImage("https://jamietalksanime.files.wordpress.com/2016/03/one-punch-man-16.gif")
    .setColor("000000")
    .addField("hug", "Fait un beau calin")
    .addField("punch", "frappe très fort")
    .setFooter("Page 2")

    bot.on("raw", event => {
      if(event.t = "MESSAGE_REACTION_ADD"){
        if(event.d.message_id === idmsg){
          if(event.d.emoji.name === "2️⃣"){
          msg.edit(embed2)
          }
          if(event.d.emoji.name === "1️⃣"){
            msg.edit(embed)
        }        
      }
    }})
    }
 



  //if(!db.get("Infos_membres").find({id: msgauthorid}).value()){
  //  db.get("Infos_membres").push({id: msgauthorid, xp: 1, niveau: 1, xp_p_niveau: 50 }).write()
  //}else{
   // let userxpdb = db.get("Infos_membres").filter({id: msgauthorid}).find("xp").value()
    //let userxp = Object.values(userxpdb)
   // let userniveaudb = db.get("Infos_membres").filter({id: msgauthorid}).find("niveau").value()
   // let userniveau = Object.values(userniveaudb)
   // let userpnieveaudb = db.get("Infos_membres").filter({id: msgauthorid}).find("xp_p_niveau").value()
   // let userpnieveau = Object.values(userpnieveaudb)

    //let chiffre = [3, 4, 5, 6, 7]
    //let index = Math.floor(Math.random() * (chiffre.length - 1) + 1)

   // db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp: userxp[1] += chiffre[index]}).write()


    //if(userxp[1] >= userpnieveau[3]){
     // db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp: userxp[1] = 1}).write()
     // db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, niveau: userniveau[2] += 1}).write()
     // db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp_p_niveau: userpnieveau[3] += 10}).write()
     // let nv = bot.guilds.cache.get(config.Wserverid).channels.cache.get(config.channelidlvl)
     // console.log("lvl up ")
     // message.channel.send(`bravo a toi **${message.author}** tu es passé au niveau ${userniveau[2]}`)


      

    //}
  //}

})



//------------Kick--------------
//https://discord.com/oauth2/authorize?client_id=796080800852213760&scope=bot&permissions=8

//------------Mute--------------\\
//bot.on("message", async message =>{
  ////if(message.content.startsWith(config.prefix+"mute")){
   // if(message.member.hasPermission("ADMINISTRATOR")){
   // let User = message.guild.member(message.mentions.users.first())
   // let time = message.content.split(" ").slice(2)
   // let reason = message.content.split(" ").slice(3)
  //  if (!time || !User || !reason) return message.reply("Merci d'utiliser la syntaxte : \nmute @User <time> <reason>")
   // let dUser = User.id
  //  if(dUser === message.author.id) return message.reply("Vous ne pouvez pas vous mute vous même :/")
  //  if(isNaN(time[0])) return message.reply("Veuillez entrer une valeur chiffrer pour le temps")
  //  if(time[0] <= 0 ) return message.reply("Veuillez mettre une valeur supérieur a 0 pour le temps")
  //  let muterole = config.muterole
  //  if(User.roles.cache.has(muterole)) return message.reply("Ce membre est déja muets")

  //  message.channel.send( "*" + User.displayName + "*" +  " a bien été mute par " + "*" +  message.author.username + "Temps: "+ "** " + time[0]  + "minute**") //remettre minute a la fin des test et changer 60000

   // User.roles.add(muterole)
    //User.roles.remove("805446205818667029")

   // setTimeout(() => {
    //  User.roles.remove(muterole)
    //  User.roles.add("805446205818667029")
    //  message.channel.send(User.displayName + " a bien été Unmute !")
    //}, time[0] * 60000)
  //}else message.channel.send("Vous n'avez pas la permision de faire cette commande")
  //}
  //})

//------------Unmute--------------\\


//------------clear--------------\\


bot.on("message", async message => {
  //pp
if(message.content.startsWith(config.prefix+"avatar")){
  let User = message.guild.member(message.mentions.users.first())
  let us = message.mentions.users.first()
  message.channel.send(`Voici la pp de ${User} :  \n`+ us.displayAvatarURL({dynamic: true}))
}
//server
bot.on("message", async message => {
  if(message.content === config.prefix+"membre") return message.channel.send("Il y a actuellement "+message.guild.memberCount+" membres sur le serveur")
 
  if(message.content === config.prefix+"serverinfo"){
    let member = message.guild.memberCount
    let date = message.guild.createdAt
    let owner = message.guild.owner
    let embed = new Discord.MessageEmbed()
    embed.setTitle("Serveur info ! ")
    .setDescription("Préfix = **"+ config.prefix + "**")
    .setImage("https://cdn.discordapp.com/attachments/844589279224266762/844590265133826048/d08b4e367d5f5378d20b48370785833d.gif")
    .setColor("000000")
    .addField("Date de création", date)
    .addField("Owner", owner.tag)
    .addField("Membre", member)
    .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
    message.channel.send(embed)
  }
})

})


bot.on("message", async message => {
  if(message.content === config.prefix+"hug"){
    const member = message.member;

            const kiss = [
            `https://i.pinimg.com/originals/d1/d3/a0/d1d3a02a8356549fcd48796b318d6b58.gif`,
            `https://i.pinimg.com/originals/5c/6c/a6/5c6ca66dbf69a5c5c0881caa275547ed.gif`,
            `https://data.whicdn.com/images/213476418/original.gif`,
            `https://media1.tenor.com/images/56c73f380d3ad747ff0600eb7ea1bbc7/tenor.gif`,
            `https://media2.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif`,
            `https://i.pinimg.com/originals/6d/b5/4c/6db54c4d6dad5f1f2863d878cfb2d8df.gif`,
            `https://thumbs.gfycat.com/FocusedCoordinatedAlaskajingle-size_restricted.gif`
        ]


      const embed = new Discord.MessageEmbed()
        .setDescription(`**${member.user.username}** a envie d'un calin :heart_eyes:`, message.author.avatarURL)
        .setImage(kiss[Math.floor(Math.random() * kiss.length)])
        .setFooter('Commande faite par ' + member.user.username)
        .setColor("RANDOM")

        message.channel.send(embed);
  }
  if(message.content === config.prefix+"punch"){
  const member = message.member

            const kiss = [
            `https://thumbs.gfycat.com/EssentialSillyBobcat-max-1mb.gif`,
            `https://pa1.narvii.com/6272/cf24160e6b4e98e2e40a3b2633a3cce7c31ed4f7_hq.gif`,
            `https://thumbs.gfycat.com/PoliticalAbleFennecfox-size_restricted.gif`,
            `https://pa1.narvii.com/6724/4daa91b820e74e1ce10574cbac4772d5169f84fa_hq.gif`,
            `https://thumbs.gfycat.com/ShinyRecklessBobwhite-size_restricted.gif`,
            `https://media1.tenor.com/images/34356db15b5e28ca27307ba87325e67d/tenor.gif`,
            `https://i.pinimg.com/originals/76/0b/3f/760b3fc3deac11d2163ea305987bd9bd.gif`
        ]


      const embed = new Discord.MessageEmbed()
        .setDescription(`**${member.user.username}** a envie de puncher des têtes :punch:`, message.author.avatarURL)
        .setImage(kiss[Math.floor(Math.random() * kiss.length)])
        .setFooter('Commande faite par ' + member.user.username)
        .setColor("RANDOM")

        message.channel.send(embed)
      }
}
)
