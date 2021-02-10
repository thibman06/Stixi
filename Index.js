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

//------------Connection--------------\\
bot.login(process.env.TOKEN)
bot.on("ready", async message => {
    let guildW =  bot.guilds.cache.get(config.Wserverid)
    let channelW =  bot.channels.cache.get(config.Wchannelid)
    //let rolew = bot.roles.cache.get(config.Wroleid) //let rolew = bot.roles.cache.get(config.Wroleid)
    let lvlchannel = bot.channels.cache.get(config.channelidlvl)
    //let mutrole = bot.roles.cache.get(config.muterole)

    console.log("Préfix = "+ "NONE TOKEN" )
    console.log("token = " + config.token)
    console.log("Serveur = " + guildW.name)
    console.log("Salon bienvenue/au revoir = " + channelW.name)
    //console.log("Autorole = " + rolew.name)
    console.log("Channel Check level Up = " + lvlchannel.name)
    //console.log("mute role = " + mutrole.name)
    console.log("Je suis prêt !")
})
 


//------------message--------------\\
bot.on("message", async message => {
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
    if(message.content === config.prefix+"ping"){
        message.channel.send("**Pong ! :ping_pong: **")
    }
    let msgid;
    if(message.content === config.prefix+"help"){
      let embed = new Discord.MessageEmbed()
      .setTitle("Menu d'aide de Stixi bot !")
      .setDescription("Préfix = \\*!*")
      .setImage("https://jamietalksanime.files.wordpress.com/2016/03/one-punch-man-16.gif")
      .setColor("000000")
      .addField("Ping", "Réponds Pong", true)
      .addField("Emping", "Réponds Pong mais en embed", true)
      let msg = await message.channel.send(embed)
      idmsg = msg.id
      await msg.react("❤️")
  }

  let msgauthorid = message.author.id 

  if(!db.get("Infos_membres").find({id: msgauthorid}).value()){
    db.get("Infos_membres").push({id: msgauthorid, xp: 1, niveau: 1, xp_p_niveau: 50 }).write()
    console.log("ça marche !")
  }else{
    let userxpdb = db.get("Infos_membres").filter({id: msgauthorid}).find("xp").value()
    let userxp = Object.values(userxpdb)
    let userniveaudb = db.get("Infos_membres").filter({id: msgauthorid}).find("niveau").value()
    let userniveau = Object.values(userniveaudb)
    let userpnieveaudb = db.get("Infos_membres").filter({id: msgauthorid}).find("xp_p_niveau").value()
    let userpnieveau = Object.values(userpnieveaudb)

    let chiffre = [3, 4, 5, 6, 7]
    let index = Math.floor(Math.random() * (chiffre.length - 1) + 1)

    db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp: userxp[1] += chiffre[index]}).write()


    if(userxp[1] >= userpnieveau[3]){
      db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp: userxp[1] = 1}).write()
      db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, niveau: userniveau[2] += 1}).write()
      db.get("Infos_membres").find({id: msgauthorid}).assign({id: msgauthorid, xp_p_niveau: userpnieveau[3] += 10}).write()
      let nv = bot.guilds.cache.get(config.Wserverid).channels.cache.get(config.channelidlvl)
      console.log("lvl up ")
      nv.send(`bravo a toi **${message.author}** tu es passé au niveau ${userniveau[2]}`)

    }
  }

})



//------------bienvenue--------------\\
bot.on("guildMemberAdd", async member => {
  let bienvenue = bot.guilds.cache.get(config.Wserverid).channels.cache.get(config.Wchannelid)
  member.roles.add(config.Wroleid)
  console.log("Bievenue")
  bienvenue.send(`Bienvenue a toi **${member}**`)
})

//------------au revoir--------------\\
bot.on("guildMemberRemove", async member => {
  let bye  = bot.guilds.cache.get("803977643712184360").channels.cache.get("803977643712184363")
  console.log("au revoir")
  bye.send(`Au revoir a toi **${member.displayName}**`)
})





//------------Réaction--------------\\
bot.on("raw", event => {
  if(event.t === "MESSAGE_REACTION_ADD"){
    if(event.d.message_id === idmsg){
      let guild = bot.guilds.cache.get(event.d.guild_id)
      let member = guild.members.cache.get(event.d.user_id)
      let channel = guild.channels.cache.get(event.d.channel_id)
      if(member.bot) return 

      if(event.d.emoji.name === "❤️"){
        member.roles.add("805377182561075230")
      }
    }
  }
})


//------------XP--------------\\

bot.on("message", async message => {

})

//------------Kick--------------\\

bot.on("message", async message =>{
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
})

//https://discord.com/oauth2/authorize?client_id=796080800852213760&scope=bot&permissions=8

//------------Mute--------------\\
bot.on("message", async message =>{
  if(message.content.startsWith(config.prefix+"mute")){
    if(message.member.hasPermission("ADMINISTRATOR")){
    let User = message.guild.member(message.mentions.users.first())
    let time = message.content.split(" ").slice(2)
    let reason = message.content.split(" ").slice(3)
    if (!time || !User || !reason) return message.reply("Merci d'utiliser la syntaxte : \nmute @User <time> <reason>")
    let dUser = User.id
    if(dUser === message.author.id) return message.reply("Vous ne pouvez pas vous mute vous même :/")
    if(isNaN(time[0])) return message.reply("Veuillez entrer une valeur chiffrer pour le temps")
    if(time[0] <= 0 ) return message.reply("Veuillez mettre une valeur supérieur a 0 pour le temps")
    let muterole = config.muterole
    if(User.roles.cache.has(muterole)) return message.reply("Ce membre est déja muets")

    message.channel.send( "*" + User.displayName + "*" +  " a bien été mute par " + "*" +  message.author.username + "*" + " Raison: " + "**" + reason + "** " + "Temps: "+ "** " + time[0]  + "minute**") //remettre minute a la fin des test et changer 60000

    User.roles.add(muterole)

    setTimeout(() => {
      User.roles.remove(muterole)
      message.channel.send(User.displayName + " a bien été Unmute !")
    }, time[0] * 60000)
  }else message.channel.send("Vous n'avez pas la permision de faire cette commande")
  }
  })

//------------Unmute--------------\\
bot.on("message", async message =>{
  if(message.content.startsWith(config.prefix+"unmute")){
    if(message.member.hasPermission("ADMINISTRATOR")){
    let User = message.guild.member(message.mentions.users.first())
    if(User.roles.cache.has(config.muterole)){
      User.roles.remove(config.muterole)
      message.channel.send(User.displayName + " a bien été Unmute !")
    }
      message.channel.send("Ce membre est déja mute")
    }else message.channel.send("Vous n'avez pas la permission")
  }
}
)

//------------clear--------------\\
bot.on("message", async message =>{
  if(message.content.startsWith(config.prefix+"clear")){
    if(message.member.hasPermission("ADMINISTRATOR")){
    let dl = message.content.split(" ").slice(1)
    if(!dl || isNaN(dl) || dl < 1) return message.reply("Veuillez choisir un nombre entre 1 et 100")
    let dlf = Number(dl)
    message.channel.bulkDelete(dlf+1, true).then(message => message.channel.send(dlf + "message on été supprimé ")).catch(console.error)
  }else message.channel.send("Vous n'avez pas la permission")
}
})


//------------ticket set message--------------\\
let tid;
bot.on("message", async message => {
  if(message.content === config.prefix+"tick"){
      let embed = new Discord.MessageEmbed()
      .setTitle("Crée un ticket")
      .setDescription("Cliquer sur la réaction pour ajouter un ticket")
      .setColor("000000")
      let msg = await message.channel.send(embed)
      tid = msg.id
      await msg.react("✉️")
  }
})

//------------Ticket--------------\\

bot.on("raw", event => {
if(event.t === "MESSAGE_REACTION_ADD"){ 
  console.log("test")
   if(event.d.message_id === "806939337916678144"){
    let member = bot.guilds.cache.get(event.d.guild.id).members.cache.get(event.d.user_id)

    if(event.d.emoji.name === "✉️"){
      console.log("Ticket crée")
      member.guild.channels.create(`『✉』│𒌇│ticket ${member.user.username}`, {type: "text"}).then(chann => {
        let category = member.guild.channels.cache.get(config.ticketcategoid, c => c.type = "category")
         chann.setParent(category)

        let role1 = member.guild.roles.cache.get (config.role1)
        let everyone = member.guild.roles.cache.get ("805446205818667028")

        chann.updateOverwrite(role1, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true

        })

        chann.updateOverwrite(member, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true

        })

        chann.updateOverwrite(everyone, {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: false

        })
       }).catch(console.error)
     }
   }
 }})

 bot.on("message", async message =>{
   if(message.content === config.prefix+"close"){
     if(message.channel.parentID === config.ticketcategoid){
       message.channel.send("le problème a été réglé, le salon sera fermé dans 30 seconde ! ")
       message.guild.channels.cache.get(message.channel.id).setName(`『✉』│𒌇│fermée`)
       setTimeout(() => {
         message.channel.delete()
       }, 30*600
       )
     }
   }
 })