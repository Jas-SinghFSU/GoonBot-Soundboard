const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');

const {
	createAudioPlayer,
	AudioPlayerStatus,
	getVoiceConnection,
} = require('@discordjs/voice');

/****************************
 *    METHOD DECLARATIONS   *
 ****************************/

const channelTimeout = async () => {
	try {
		const voiceConnection = getVoiceConnection(activeGuildId);
		if (Date.now() > botDisconnectTimer && voiceConnection !== undefined) {
			log.info(`[channelTimeout] Disconnecting the bot`);
			voiceConnection.disconnect();
		}
	} catch (error) {
		log.error(`[channelTimeout] Failed to disconnect. ${error.message}`);
	}
};

/******************************
 *    CLIENT INITIALIZATION   *
 ******************************/

client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

try {
	log.info('Logging into discord client.');

	client.login(token);

	log.info('Discord client logged in successfully.');
} catch (error) {
	log.error(`Discord client failed to log in. Error: ${error.message}`);
}

/****************************
 *  CLIENT EVENT LISTENERS  *
 ****************************/

client.on('ready', () => {
	log.info('Discord client has been initialized successfully.');

	isReady = true;

	// Check channel timeOut status every minute
	setInterval(channelTimeout, timeMultiplier.minutes(1));
});

/**********************************
 *  AUDIO PLAYER EVENT LISTENERS  *
 **********************************/

log.info('Initializing audioPlayer');
audioPlayer = createAudioPlayer();

audioPlayer.on('error', (err) => {
	log.error(`An error occurred with the audio player. ${err.message}`);
});

audioPlayer.on(AudioPlayerStatus.Playing, () => {
	log.info('The audio player has started playing the requested resource!');
});

audioPlayer.on(AudioPlayerStatus.Idle, () => {
	log.info('The audio player has is now idle.');
	isReady = true;
});
