const express = require('express');
const router = express.Router();
const {
	getVoiceChannels,
	getServerInfo,
} = require('../Helpers/discordModules');

router.get('/channels/voice/:password/', async (req, res) => {
	const { password } = req.params;
	if (password !== apiPassword) {
		return res.status(500).send('Invalid password');
	}

	try {
		const channelData = await getVoiceChannels();
		return res.send(channelData);
	} catch (error) {
		return res
			.status(500)
			.send(`Failed to get voice channels. ${error.message}`);
	}
});

router.get('/:password', async (req, res) => {
	const { password } = req.params;
	if (password !== apiPassword) {
		return res.status(500).send('Invalid password');
	}

	try {
		const serverData = await getServerInfo();
		return res.send(serverData);
	} catch (error) {
		return res
			.status(500)
			.send(`Failed to get voice channels. ${error.message}`);
	}
});

module.exports = router;
