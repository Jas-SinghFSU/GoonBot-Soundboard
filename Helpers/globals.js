const config = require('../config.json');
const initializeGlobals = () => {
	/****************************
	 *      LOGGER GLOBALS      *
	 ****************************/
	global.log = null;

	/****************************
	 *     DISCORD GLOBALS      *
	 ****************************/
	global.isReady = false;
	global.botDisconnectTimer = 60000;
	global.voiceChannel = null;
	global.currentChannelId = null;
	global.activeGuildId = '208271303126286336';
	global.audioPlayer = null;
	global.client = null;

	/****************************
	 *      HELPER GLOBALS      *
	 ****************************/
	global.timeMultiplier = {
		hours: (n) => 3600000 * n,
		minutes: (n) => 60000 * n,
		seconds: (n) => 1000 * n,
	};

	/****************************
	 *       API GLOBALS        *
	 ****************************/
	global.apiPassword = config.apiPassword;
};

module.exports = {
	initializeGlobals,
};
