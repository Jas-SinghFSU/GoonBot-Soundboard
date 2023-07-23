import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Soundboard from '../Pages/Soundboard/index';

const RoutesContainer = () => {
	return (
		<Routes>
			<Route
				path="*"
				element={
					<PrivateRoute>
						<Soundboard />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
};

export default RoutesContainer;
