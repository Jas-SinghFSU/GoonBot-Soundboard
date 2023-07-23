import React, { Fragment, useEffect, useState } from 'react';

import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import './style.css';

const PlayerSettings = ({
	volumeValue,
	handleVolume,
	channelName,
	handleChannel,
	channels,
}) => {
	const generateChannels = () => {
		const channelElements = channels.map((ch) => {
			return (
				<MenuItem key={ch.id} value={ch.id}>
					{ch.name}
				</MenuItem>
			);
		});

		return channelElements;
	};

	return (
		<Fragment>
			<div className="channel-selector-container">
				<Select
					labelId="channel-selector-label"
					id="channel-selector-content"
					value={channelName}
					onChange={handleChannel}
					label="Channel"
					variant="standard"
				>
					{generateChannels()}
				</Select>
			</div>
			<Stack
				id="volume-stack"
				spacing={2}
				direction="row"
				sx={{ width: '100%' }}
				alignItems="center"
			>
				<VolumeDown />
				<Slider
					aria-label="Volume"
					size="small"
					value={volumeValue}
					onChange={handleVolume}
					valueLabelDisplay="auto"
				/>
				<VolumeUp />
			</Stack>
		</Fragment>
	);
};

export default PlayerSettings;
