#Discord.bot



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
  
   if(event.d.message.id == "806939337916678144"){
    let member = bot.guilds.cache.get(event.d.guild.id).members.cache.get(event.d.user_id)  //
    console.log("Ticket set by " + {member})
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







 //------------Activité--------------\\



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
        member.roles.add("810103960408948777")
      }
    }
  }
})


//------------XP--------------\\

bot.on("message", async message => {

})
