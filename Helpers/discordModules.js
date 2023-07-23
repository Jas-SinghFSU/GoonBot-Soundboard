const {
	AudioPlayerStatus,
	joinVoiceChannel,
	createAudioResource,
} = require('@discordjs/voice');

const { join } = require('node:path');
const fs = require('fs');

/**
 * @memberof discordModules
 * @method playAudio
 * @description Plays an audio file
 *
 * @param {string} audioFile - The path of the audio file to play
 * @param {string} channelId - The ID of the channel to play the audio file in
 */

const playAudio = (audioFile, channelId, volume) => {
	if (!isReady) {
		const playError = `The audio player isn't ready yet... it may be playing a command already.`;
		log.error(`[playAudio] ${playError}`);
		throw new Error(playError);
	}

	// TODO Figure out if the bot is already in the channel. If not then we need to add a wait timer before playing the audio
	// const botsCurrentChannel = connection.joinConfig.channelId;

	const connection = joinVoiceChannel({
		channelId: channelId,
		guildId: activeGuildId,
		adapterCreator: client.guilds.cache.get(activeGuildId).voiceAdapterCreator,
	});

	const subscription = connection.subscribe(audioPlayer);

	currentChannelId = channelId;

	const resourcePath = join(__dirname, `../Audio/${audioFile}`);

	if (!fs.existsSync(resourcePath)) {
		const fileError = `The file "${resourcePath}" doesn't exist`;
		log.error(`[playAudio] ${fileError}`);
		throw new Error(fileError);
	}

	log.debug(`[playAudio] Creating audio resource for: ${resourcePath}`);

	let resource = createAudioResource(resourcePath, { inlineVolume: true });
	resource.volume.setVolume(volume);

	log.debug(`[playAudio] Resource ${resourcePath} is ready to be played.`);
	isReady = false;
	audioPlayer.play(resource);

	if (subscription) {
		setTimeout(() => {
			subscription.unsubscribe();
			isReady = true;
			log.info(`[playAudio] Usubscribed from connection.`);
		}, 12_000);
	}

	botDisconnectTimer = Date.now() + timeMultiplier.hours(1);
};

/**
 * @memberof discordModules
 * @method getAudioFileNames
 * @description Plays an audio file
 *
 * @param {string} audioFile - The path of the audio file to play
 * @param {string} channelId - The ID of the channel to play the audio file in
 */

const getAudioFileNames = () => {
	try {
		log.debug(`[getAudioFileNames] Fetching Audio Resources`);
		const audioResourcesPath = join(__dirname, `../Audio`);
		const fileNames = fs.readdirSync(audioResourcesPath);
		const audioFilesMetadata = [];

		const directoryNames = fileNames.filter((fileName) =>
			fs.lstatSync(`${audioResourcesPath}/${fileName}`).isDirectory()
		);

		const validAudioFiles = fileNames.filter((fileName) =>
			/^.*\.(mp3|wav)$/.test(fileName)
		);

		validAudioFiles.forEach((fileName) => {
			audioFilesMetadata.push({
				commandName: fileName.replace(/\.[^/.]+$/, '').toLowerCase(),
				commandPath: fileName,
			});
		});

		log.debug(
			`[getAudioFileNames] Fetching Audio Resources for sub-directories`
		);

		for (const directoryName of directoryNames) {
			const directoryResourcesPath = join(
				__dirname,
				`../Audio/${directoryName}`
			);
			const audioFilesInDirectory = fs
				.readdirSync(directoryResourcesPath)
				.filter((fileName) => /^.*\.(mp3|wav)$/.test(fileName));

			audioFilesMetadata.push({
				commandName: directoryName.toLowerCase(),
				commandPaths: audioFilesInDirectory,
			});
		}

		return audioFilesMetadata;
	} catch (error) {
		const errMsg = `An error occurred while fetching audio files. ${error.message}`;
		log.error(`[getAudioFileNames] ${errMsg}`);
		throw new Error(errMsg);
	}
};

/**
 * @memberof discordModules
 * @method getVoiceChannels
 * @description Returns a list of all voice channels
 *
 * @returns {object} - The metadata of all voice channels
 */

const getVoiceChannels = async () => {
	const { available: serverStatus, channels: serverChannels } =
		client.guilds.cache.get(activeGuildId);

	if (serverStatus === false) {
		const serverOfflineError = `The server is not available.`;
		log.error(
			`[getVoiceChannels] An error occured while fetching voice channels: ${serverOfflineError}`
		);
		throw new Error(serverOfflineError);
	}

	try {
		log.debug('[getVoiceChannels] Fetching channel data for server...');

		const channelData = await serverChannels.fetch();

		log.debug('[getVoiceChannels] Successfully fetched channel data.');

		const onlyVoiceChannels = channelData.filter(
			(channel) => channel.type === 2
		);

		return onlyVoiceChannels;
	} catch (error) {
		const channelFetchFailureMsg = `Failed to fetch channel list. ${error.message}`;

		log.error(`[getVoiceChannels] ${channelFetchFailureMsg}`);
		throw new Error(channelFetchFailureMsg);
	}
};

/**
 * @memberof discordModules
 * @method getServerInfo
 * @description Get information for server such as name, icon, etc.
 *
 * @returns {object} - The metadata of the server
 */

const getServerInfo = async () => {
	try {
		log.debug('[getServerInfo] Fetching server info...');
		const guildMetadata = client.guilds.cache.get(activeGuildId);

		const serverIcon = guildMetadata.iconURL();

		const returnObject = {
			serverId: guildMetadata.id,
			serverName: guildMetadata.name,
			serverIcon,
		};

		return returnObject;
	} catch (error) {
		const errMsg = `Failed to fetch server info. ${error.message}`;
		log.error(`[getServerInfo] ${errMsg}`);
		throw new Error(errMsg);
	}
};

module.exports = {
	playAudio,
	getVoiceChannels,
	getAudioFileNames,
	getServerInfo,
};
