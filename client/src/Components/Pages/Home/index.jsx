import React, { useContext, useState, useEffect } from 'react';
import AuthProvider from '../../../Contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import config from '../../../private/config.json';

import './style.css';

const Home = () => {
	const { setIsLoggedIn, isLoggedIn } = useContext(AuthProvider.context);

	const [passwordStatus, setPasswordStatus] = useState('primary');
	const redirectTo = useNavigate();

	const handleSubmit = (e) => {
		if (e.keyCode === 13) {
			if (e.target.value === config.password) {
				setIsLoggedIn(true);
				redirectTo('/soundboard');
			} else {
				setPasswordStatus('error');
			}
		}
	};

	useEffect(() => {
		if (isLoggedIn) {
			return redirectTo('/soundboard');
		}
	}, []);

	return (
		<div className="homepage">
			<div className="homepage-login-container">
				<div className="login-container-flexbox">
					<span className="password-label-span">Enter Password</span>
					<TextField
						id="standard-password-input"
						type="password"
						autoComplete="current-password"
						variant="standard"
						onKeyDown={handleSubmit}
						color={passwordStatus}
						focused
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
