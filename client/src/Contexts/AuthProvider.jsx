import React, { createContext, useState } from 'react';

const context = createContext(null);

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<context.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</context.Provider>
	);
};

AuthProvider.context = context;

export default AuthProvider;
