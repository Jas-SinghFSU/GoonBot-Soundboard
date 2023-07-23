import React, { useContext, useState } from 'react';
import AuthProvider from '../../Contexts/AuthProvider';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
	const { isLoggedIn } = useContext(AuthProvider.context);

	if (isLoggedIn === true) {
		return children;
	}

	return <Navigate to="/" />;
};

export default PrivateRoute;
