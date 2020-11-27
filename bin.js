var express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3479 || process.env.PORT;
const Discord = require("discord.js");
const { stat } = require('fs');
const client = new Discord.Client();
const request = require("request");
const ms = require('ms');
var setTitle = require('console-title');
const readline = require("readline")
var center = require('center-align');
var colors = require("colors")
const fs = require("fs");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let statuses = {
    tokenStatus: {
        status: false,
        message: "❌ An invalid token was provided!"
    },
    cloneStatus: {
        status: true,
        message: ""
    }
};

async function checkServer (serverID) {
    let server = client.guilds.get(serverID);

    if (!server) {
        return false;
    } else if (server.id === serverID){
        return true;
    }
}

async function checkToken(token) {
    if (token === "") {
        statuses.tokenStatus.status = false;
        statuses.tokenStatus.message = "❌ An invalid token was provided!";

        return false;
    }

    await request({
        method: "GET",
        url: "https://discordapp.com/api/v7/users/@me",
        headers: {
            authorization: token
        }
    }, (error, response, body) => {
        if (!body) return;
        var json = JSON.parse(body);
        if (!json.id || json.bot) {
            statuses.tokenStatus.status = false;
            statuses.tokenStatus.message = "❌ An invalid token was provided!";
            return false;
        } else if (!json.verified) {
            statuses.tokenStatus.status = false;
            statuses.tokenStatus.message = "❌ This user has an unverified account!";
            return false;
        } else if (json.id) {
            statuses.tokenStatus.status = true;
            statuses.tokenStatus.message = "✅ Token valid.";
            return true;
        }
    });
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/tryClone', async function(req, res){
    await checkToken(req.body.token);

    if (checkToken(req.body.token) && checkServer(req.body.copyserv) && checkServer(req.body.pasteserv)) {
        let token = req.body.token
        let copy = req.body.copyserv
        let paste = req.body.pasteserv

        client.on("error", (e) => {
            statuses.cloneStatus.status = false;
            statuses.cloneStatus.message = "❌ Error: " + e;
        });

        client.on("warn", (e) => {
            statuses.cloneStatus.status = false;
            statuses.cloneStatus.message = "❌ Error: " + e;
        });

        (async function () {
        client.on("ready", async() => {
            let guild1 = client.guilds.get(`${copy}`);
            let guild2 = client.guilds.get(`${paste}`);

            if  (!guild1) {
                statuses.cloneStatus.status=false;
                return statuses.cloneStatus.message="❌ Clone server not found, or you're not in it.";
            }

            if  (!guild2) {
                statuses.cloneStatus.status=false;
                return statuses.cloneStatus.message="❌ Paste server not found, or you're not in it.";
            } else if (!guild2.me.hasPermission("ADMINISTRATOR")) {
                statuses.cloneStatus.status=false;
                statuses.cloneStatus.message="❌ You don't have ADMINISTRATOR permissions in the paste server.";
            }

            let channels = guild1.channels.filter(c => c.type === "text").sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c => c);
            let categories = guild1.channels.filter(c => c.type === "category").sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c => c);
            let roles = guild1.roles.sort((a, b) => b.calculatedPosition - a.calculatedPosition).map(r => r);
            let voice = guild1.channels.filter(c => c.type === "voice").sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c => c);

            console.log(channels)

        let allowedRegions = ['brazil', 'us-west', 'singapore', 'eu-central', 'hongkong',
                            'us-south', 'amsterdam', 'us-central', 'london', 'us-east', 'sydney', 'japan',
                            'eu-west', 'frankfurt', 'russia'];

        let region = allowedRegions.includes(guild2.region) ? guild2.region : 'eu-central';

            let guildname = guild1.name + " - cloned by SClone";
            let guildico = guild1.iconURL;

            guild2.channels.deleteAll();

            await guild2.setIcon(guildico)
            await guild2.setName(guildname)
            await guild2.setRegion(region)
            await guild2.setVerificationLevel(guild1.verificationLevel)

            for (var i = 0; i < roles.length; i++) {
                let do2 = guild2.roles.find(c => c.name === roles[i].name)
                if (do2) continue;
                await guild2.createRole({
                    type: roles[i].type,
                    name: roles[i].name,
                    color: roles[i].hexColor,
                    hoist: roles[i].hoist,
                    permissions: roles[i].permissions,
                    managed: roles[i].managed,
                    mentionable: roles[i].mentionable
                })
            }


            guild1.emojis.forEach(async emoji => {
                let do2 = guild2.emojis.find(c => c.name === emoji.name)
                if (do2) return;
                await guild2.createEmoji(emoji.url, emoji.name)
            })

            categories.forEach(async(category) => {
                let do2 = guild2.channels.find(c => c.name === category.name)
                if (do2) return;

                await guild2.createChannel(category.name, 'category')
            })

                for (var i = 0; i < channels.length; i++) {
                    let do1 = channels[i]
                    let do2 = guild2.channels.find(c => c.name === do1.name)
                    if (do2) continue;

                    if (!do1.parent) {
                        var channel2 = await guild2.createChannel(do1.name, 'text')
                        if (channels[i].topic) {
                            await channel2.setTopic(channels[i].topic)
                        }
                    }
                    if (do1.parent) {
                        var channel = await guild2.createChannel(do1.name, 'text')
                        if (channels[i].topic) {
                            channel.setTopic(channels[i].topic)
                        }
                        var ll = guild2.channels.find(c => c.name === do1.parent.name)
                        if (ll) {
                            await channel.setParent(guild2.channels.find(c => c.name === do1.parent.name).id)
                        } else {
                            var ll1 = await guild2.createChannel(do1.parent.name, 'category')
                            await channel.setParent(ll1)
                        }
                    }

                for (var i = 0; i < voice.length; i++) {
                    let do1 = voice[i]
                    let do2 = guild2.channels.find(c => c.name === do1.name)
                    if (do2) continue;
                    if (!do1.parent) {
                        await guild2.createChannel(do1.name, 'voice')
                    }
                    if (do1.parent) {
                        var channel = await guild2.createChannel(do1.name, 'voice')
                        var ll = guild2.channels.find(c => c.name === do1.parent.name)
                        if (ll) {
                            await channel.setParent(guild2.channels.find(c => c.name === do1.parent.name).id)
                        } else {
                            var ll1 = await guild2.createChannel(do1.parent.name, 'category')
                            await channel.setParent(ll1)
                        }
                    }
                }
            }
            if  (statuses.cloneStatus.status) {
                statuses.cloneStatus.status = true;
                statuses.cloneStatus.message = "✅ Clone finished."
            } else {
                statuses.cloneStatus.status = false;
                statuses.cloneStatus.message = "❌ Clone failed."
            }
        })
        client.login(token).catch(()=>{ statuses.tokenStatus.status = false; statuses.tokenStatus.message = "❌ An invalid token was provided!"; });
        })();
    };

    res.status(200);
});

app.get('/getStatus', async function (req, res) {  
    response = statuses;
    await res.end(JSON.stringify(response));  
});

app.get('/getConsole', async function (req, res) {  
    response = statuses;
    await res.end(JSON.stringify(response));  
});

app.listen(port);