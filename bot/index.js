const Discord = require('discord.js')
const { Client, Intents } = Discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
require('dotenv').config()
const axios = require("axios")

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    console.log(`Registering slash commands`)

    const guildId = "903701503108321420"
    const guild = client.guilds.cache.get(guildId)
    let commands

    if(guild) {
        commands = guild.commands
    } else {
        commands = client.application.commands
    }

    commands?.create({
        name: "setbraincell",
        description: "Change le nombre de neuronnes actuelle à l'utilisateur ciblé.",
        options: [
            {
                name: "user",
                description: "Selectionner quelqu'un",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.USER
            },{
                name: "number",
                description: "Nombre de neuronne à ajouter",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    })

    commands?.create({
        name: "register",
        description: "Enregistrer un utilisateur.",
        options: [
            {
                name: "user",
                description: "Selectionner quelqu'un",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.USER
            }
        ]
    })

    commands?.create({
        name: "showbraincell",
        description: "Afficher les neuronnes de quelqu'un.",
        options: [
            {
                name: "user",
                description: "Selectionner quelqu'un, affiche tout le monde si non indiqué.",
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.USER
            }
        ]
    })

    console.log(`Slash commands registered`)
})

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return

    const { commandName, options } = interaction

    if(commandName === "setbraincell") {
        const opt1 = options.getUser("user")
        const opt2 = options.getNumber("number")

        await interaction.deferReply({
            ephemeral : false
        })

        let response = await axios.put("http://localhost:3000/addbraincell", {
            id: opt1.id,
            braincell: opt2
        })

        if(response.data.success) {
            interaction.editReply({
                content: response.data.message
            })
        } else {
            interaction.editReply({
                content: response.data.message
            })
        }


    } else if(commandName === "register") {
        const opt1 = options.getUser("user")

        await interaction.deferReply({
            ephemeral : false
        })

        let response = await axios.put("http://localhost:3000/register", {
            id: opt1.id,
            pseudo: opt1.username
        })

        if(response.data.success) {
            interaction.editReply({
                content: response.data.message
            })
        } else {
            interaction.editReply({
                content: response.data.message
            })
        }


    } else if(commandName === "showbraincell") {
        const opt1 = options.getUser("user")
        let embed = new Discord.MessageEmbed()
            .setTitle("Affichage des neuronnes" + (opt1 === null ? "" : ` pour ${opt1.username}`))

        await interaction.deferReply({
            ephemeral : false
        })

        let response = await axios.get("http://localhost:3000/" + (opt1 === null ? "" : opt1.id))

        if(response.data.success) {
            if(opt1 === null) {
                response.data.data.forEach((obj) => {
                    let bcHistory = ""

                    obj.braincells.forEach((braincell) => {
                        let date = new Date(braincell.updated)

                        let dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " "
                        dateString += date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())


                        bcHistory += braincell.count + " | " + dateString + "\n"
                    })

                    embed.addField(obj.pseudo, bcHistory, true)
                })
            } else {
                let bcHistory = ""
                response.data.data.braincells.forEach((obj) => {

                    let date = new Date(obj.updated)

                    let dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " "
                    dateString += date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())


                    bcHistory += obj.count + " | " + dateString + "\n"

                })

                embed.setDescription(bcHistory)
            }


            interaction.editReply({
                embeds: [embed]
            })
        } else {
            interaction.editReply({
                content: response.data.message
            })
        }
    }
})

client?.login(process.env.TOKEN)
