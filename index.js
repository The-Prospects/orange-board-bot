require('dotenv').config();
const { App } = require('@slack/bolt');
const request = require('request');
const { v4: uuidV4 } = require('uuid')

const bot = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
    // Start the app
    await bot.start(process.env.PORT || 4000);
    console.log('⚡️ Bolt app is running!');
})();

// Gives the response
bot.event("app_mention", async ({ context, event }) => {
    try{
        await bot.client.chat.postMessage({
            token: context.botToken,
            channel: event.channel,
            text: `Hello <@${event.user}> you mentioned me. To use me correctly type /orangeboard[room id here] and you will recieve a private url or type /home to log in through the orangeboard main page.`
        });
    }
    catch (e) {
        console.log(`error responding ${e}`);
    }
});

//Slash command [/orangeboard]
bot.command("/orangeboard", async ({command, ack, say}) => {
    await ack();
    await request('https://orange-board.herokuapp.com'+`/${uuidV4()}`+'/botapi', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log('statusCode:', res && res.statusCode);
        say('Here is your private session: ' + JSON.stringify(body.url));
    });
});


//Slash command [/private]
bot.command("/private", async ({command, ack, say}) => {
    await ack();
    await say('Log in through main page here: '+ 'https://orange-board.herokuapp.com/');
});
