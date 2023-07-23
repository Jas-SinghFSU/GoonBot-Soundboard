import React, { Fragment } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import './style.css';

const Player = ({ audioCommands, playFile }) => {
	const renderButtons = () => {
		const buttons = audioCommands.map((audioCmd) => {
			const handleButtonClick = () => {
				if (Object.hasOwnProperty.call(audioCmd, 'commandPaths')) {
					const randomIndex = Math.floor(
						Math.random() * (audioCmd.commandPaths.length - 0)
					);
					playFile(
						`${audioCmd.commandName}/${audioCmd.commandPaths[randomIndex]}`
					);
				} else {
					playFile(audioCmd.commandPath);
				}
			};

			if (Object.hasOwnProperty.call(audioCmd, 'commandPaths')) {
				return (
					<Button
						key={audioCmd.commandName}
						className="soundboard-button purple"
						variant="contained"
						onClick={handleButtonClick}
					>
						{audioCmd.commandName}
					</Button>
				);
			} else {
				return (
					<Button
						key={audioCmd.commandName}
						className="soundboard-button"
						variant="contained"
						onClick={handleButtonClick}
					>
						{audioCmd.commandName}
					</Button>
				);
			}
		});

		return buttons;
	};

	return (
		<Fragment>
			<div className="player-buttons-container">
				<Stack className="player-buttons-container-stack" direction="row">
					{renderButtons()}
				</Stack>
			</div>
		</Fragment>
	);
};

export default Player;
