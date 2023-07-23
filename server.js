const express = require('express');

const path = require('path');
const dotenv = require('dotenv');

const { initializeGlobals } = require('./Helpers/globals');

/**********************************
 *     INITIALIZE GLOBAL VARS     *
 **********************************/
initializeGlobals();

/****************************
 *   HANDLE LOGGING MODULE  *
 ****************************/
const pino = require('pino');
const fs = require('fs');
const dateNow = new Date();
const dateTimeFormat = JSON.stringify(dateNow)
	.replaceAll('"', '')
	.replaceAll(':', '-')
	.replaceAll('T', '_at_')
	.replace(/\..*/, '');

if (!fs.existsSync('./logs')) {
	fs.mkdirSync('./logs');
}

const fileDest = `./logs/${dateTimeFormat}.log`;
const logFile = fs.createWriteStream(fileDest);
const logger = pino(
	{
		colorize: true,
		level: 'debug',
		transport: {
			targets: [
				{
					level: 'debug',
					target: 'pino-pretty',
					options: {},
				},
				{
					level: 'debug',
					target: 'pino/file',
					options: { destination: fileDest },
				},
			],
		},
	},
	pino.destination(logFile)
);

log = logger;

/*************************************
 *     INITIALIZE DISCORD MODULES    *
 *************************************/
require('./Helpers/intializeDiscordModules');

/****************************
 *	      MIDDLEWARE        *
 ****************************/
log.info('Initializing server middleware.');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json({ extended: false }));

/**********************************
 *	   IMPORT DEFINED ROUTES      *
 **********************************/
const audioRoutes = require('./routes/audio');
const discordServerRoutes = require('./routes/discordServer');

/***************************
 *	    DECLARE ROUTES     *
 ***************************/
app.get('/', (req, res) => {
	res.send('Express + TypeScript Server');
});
app.use('/api/audio', audioRoutes);
app.use('/api/discordserver', discordServerRoutes);

/****************************
 *    SERVE CLIENT ASSETS   *
 ****************************/
log.info('Serving client-side assets');

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = port || 3000;

app.listen(PORT, logger.info(`Server started on port: ${PORT}`));
