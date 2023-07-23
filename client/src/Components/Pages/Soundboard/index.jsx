import React, { useState, useEffect } from 'react';
import config from '../../../private/config.json';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

import PlayerSettings from './PlayerSettings';
import Player from './Player';

import './style.css';

const Soundboard = () => {
	const [serverInfo, setServerInfo] = useState(null);
	const [channelInfo, setChannelInfo] = useState(null);
	const [audioCommands, setAudioCommands] = useState(null);
	const [volume, setVolume] = useState(100);
	const [channel, setChannel] = useState('');

	const allDataPopulated =
		serverInfo !== null && channelInfo !== null && audioCommands !== null;

	const getSoundboardData = async () => {
		try {
			const serverData = await axios.get(
				`api/discordserver/${config.password}/`
			);
			const channelData = await axios.get(
				`api/discordserver/channels/voice/${config.password}/`
			);
			const audioData = await axios.get(
				`api/audio/commands/${config.password}/`
			);

			setServerInfo(serverData.data);
			setChannelInfo(
				channelData.data.sort((a, b) => a.rawPosition - b.rawPosition)
			);
			setAudioCommands(
				audioData.data.sort((a, b) => (a.commandName > b.commandName ? 1 : -1))
			);

			setChannel(channelData.data[0].id);
		} catch (error) {
			console.error(
				`An error occurred while getting soundboard data: ${error.message}`
			);
		}
	};

	const playAudio = async (fileName) => {
		try {
			const payload = {
				password: config.password,
				audioCommand: fileName,
				channelId: channel,
				volume: volume / 100,
			};
			await axios.post(`api/audio/play`, payload);
		} catch (error) {
			console.error(
				`Failed to play the audio file ${fileName}. ${error.message}`
			);
		}
	};

	useEffect(() => {
		getSoundboardData();
	}, []);

	if (allDataPopulated) {
		return (
			<div className="soundboard">
				<div className="soundboard-content-container">
					<div className="soundboard-container-flexbox">
						<div className="soundboard-container-server-label-flexbox">
							<Avatar
								alt={`${serverInfo.serverName} icon`}
								src={serverInfo.serverIcon}
								sx={{ width: 100, height: 100 }}
							/>
							<h2 id="soundboard-server-label">{serverInfo.serverName}</h2>
						</div>
						<div className="soundboard-container-controls-flexbox">
							<PlayerSettings
								volumeValue={volume}
								handleVolume={(e) => {
									setVolume(e.target.value);
								}}
								channelName={channel}
								handleChannel={(e) => {
									setChannel(e.target.value);
								}}
								channels={channelInfo}
							/>
						</div>
						<div className="soundboard-container-player-flexbox">
							<Player audioCommands={audioCommands} playFile={playAudio} />
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Soundboard;
