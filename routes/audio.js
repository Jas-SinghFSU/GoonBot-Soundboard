const express = require('express');
const router = express.Router();
const { playAudio, getAudioFileNames } = require('../Helpers/discordModules');

router.post('/play', async (req, res) => {
	const { password, audioCommand, channelId, volume = 1 } = req.body;

	if (password !== apiPassword) {
		return res.status(500).send('Invalid password');
	}

	try {
		playAudio(audioCommand, channelId, volume);
		return res.send('Play Request Successful');
	} catch (error) {
		return res.status(500).send(`Failed to play audio: ${error.message}`);
	}
});

router.get('/commands/:password', async (req, res) => {
	const { password } = req.params;
	if (password !== apiPassword) {
		return res.status(500).send('Invalid password');
	}

	try {
		const audioFileData = getAudioFileNames();
		return res.send(audioFileData);
	} catch (error) {
		return res
			.status(500)
			.send(`Failed to fetch audio commands: ${error.message}`);
	}
});

module.exports = router;
