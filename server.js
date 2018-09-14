process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // uncomment for secure server

import React from 'react';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router'
import md5 from 'md5';
import colors from 'colors'
import mysql from 'mysql'
import _ from 'lodash'

import renderPage from './src/renderPage';
import App from './src/App';
import Login from './src/components/Login';
import Register from './src/components/Register';
import AddTicket from './src/components/AddTicket';
import UpdateTicket from './src/components/UpdateTicket';

const bodyParser = require('body-parser');
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);

const options = {
	host: 'localhost',
	port: 3306,
	user: '',
	password: '',
	database: ''
}

const sessionStore = new MySQLStore(options);
const connection = mysql.createConnection(options);


connection.connect(function (err) {
	if (!err) {
		console.log("Database is connected ...");
	} else {
		console.log("Error connecting database ...");
	}
});

const app = express();
const router = express.Router();

app.set('trust proxy', 1);

app.use(session({
	secret: 'testsession',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: true }
}))

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/api', router);

/**
 * API routes
 */

router.get('/session', (req, res) => {
	// console.log('req.session', req.session);
	// console.log('');
	if(req.session.user) {
		res.json({
			authenticated: true,
			type: req.session.user.id_tipouser,
			id: req.session.user.id,
			name: req.session.user.nombre
		})
	} else {
		res.json({
			authenticated: false
		})
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy(() => {
		res.json({
			authenticated: false
		})
	})
});

router.post('/login', (req, res) => {

	const { email, password } = req.body;

	if (email === '' || password === '') {
		res.send({
			"code": 400,
			"failed": "missed some data"
		})
		return;
	}

	connection.query('SELECT * FROM usuarios WHERE mail = ?', [email], function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error"
			})
		} else {
			if (results.length === 1) {
				if (results[0].pass === md5(password)) {
					const user = _.pick(results[0],'id', 'id_tipouser', 'nombre');
					req.session.user = user

					res.send({
						"code": 200,
						"success": "Login sucessfull",
						user: user
					});
				} else {
					res.send({
						"code": 204,
						"success": "Mail and pass does not match"
					});
				}
			} else {
				res.send({
					"code": 204,
					"success": "Mail does not exits"
				});
			}
		}
	});

});

router.post('/register', (req, res) => {
	const { email, name, password } = req.body;

	if(email === '' || name === '' || password === ''){
		res.send({
			"code": 400,
			"failed": "missed some data"
		})
		return;
	}

	const userinfo = {
		mail: email,
		nombre: name,
		pass: md5(password),
		id_tipouser: 2
	}

	connection.query('INSERT INTO usuarios SET ?', userinfo, function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error"
			})
		} else {
			const user = {
				id: results.insertId,
				nombre: name,
				id_tipouser: 2
			}

			req.session.user = user;

			req.session.user = _.pick(userinfo, 'nombre', 'id', 'id_tipouser')

			res.send({
				"code": 200,
				"success": "user registered sucessfully"
			});
		}
	});

});

router.get('/tickets', (req, res) => {
	if(!req.session.user){
		res.send({
			"code": 400,
			"failed": "user not logged"
		})
		return;
	}

	const id_user = req.session.user.id;
	const isAdmin = req.session.user.id_tipouser === 1;

	let sql = 'SELECT * FROM ticket';
	
	if(!isAdmin){
		sql = 'SELECT * FROM ticket WHERE id_user = ?';
	}

	connection.query(sql, [id_user], function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error getting tickets"
			})
		} else {
			res.json(results);
		}
	});
});

router.get('/ticket/:id', (req, res) => {
	if (!req.session.user) {
		res.send({
			"code": 400,
			"failed": "user not logged"
		})
		return;
	}

	const isAdmin = req.session.user.id_tipouser === 1;

	if (!isAdmin) {
		res.send({
			"code": 403,
			"failed": "unauthorized"
		})
		return;
	}

	const id = parseInt(req.params.id);

	connection.query('SELECT * FROM ticket WHERE id = ?', [id], function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error getting tickets"
			})
		} else {
			res.json(results);
		}
	});
});


router.delete('/ticket', (req, res) => {

	const { id } = req.body;

	if (id === '') {
		res.send({
			"code": 400,
			"failed": "missed id"
		})
		return;
	}

	connection.query('DELETE FROM ticket WHERE id = ?', [id], function (error, results) {
		if (error) {
			res.send({
				"code": 400,
				"failed": "error"
			})
		} else {
			res.send({
				"code": 200,
				"success": "ticket removed sucessfully"
			});
		}
	});

});


router.post('/ticket', (req, res) => {
	const { usuario, pedido } = req.body;

	if (usuario === '' || pedido === '') {
		res.send({
			"code": 400,
			"failed": "missed some data"
		})
		return;
	}

	const pedidoinfo = {
		id_user: usuario,
		ticket_pedido: pedido
	}

	connection.query('INSERT INTO ticket SET ?', pedidoinfo, function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error"
			})
		} else {
			res.send({
				"code": 200,
				"success": "ticket added sucessfully"
			});
		}
	});

});


router.put('/ticket/:id', (req, res) => {
	const { usuario, pedido } = req.body;

	if (usuario === '' || pedido === '') {
		res.send({
			"code": 400,
			"failed": "missed some data"
		})
		return;
	}

	const id = parseInt(req.params.id);

	const pedidoinfo = {
		id_user: usuario,
		ticket_pedido: pedido
	}

	connection.query('UPDATE ticket SET ? WHERE id = ?', [pedidoinfo, id], function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error"
			})
		} else {
			res.send({
				"code": 200,
				"success": "ticket added sucessfully"
			});
		}
	});

});



router.get('/users', (req, res) => {
	if (!req.session.user) {
		res.send({
			"code": 400,
			"failed": "user not logged"
		})
		return;
	}

	const id_user = req.session.user.id;
	const isAdmin = req.session.user.id_tipouser === 1;

	if (!isAdmin) {
		res.send({
			"code": 403,
			"failed": "unauthorized"
		})
		return;
	}

	connection.query('SELECT id, nombre FROM usuarios WHERE id_tipouser <> 1 ORDER BY nombre ASC', [], function (error, results) {
		if (error) {
			console.log('error', error);
			res.send({
				"code": 400,
				"failed": "error getting tickets"
			})
		} else {
			res.json(results);
		}
	});
});




/**
 * Browser Routes
 */


app.get('/', (req, res) => {

	const initialProps = JSON.stringify({});

	const context = {}
	
	const rts = renderToString(
		<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>
	);

	const html = renderPage(rts, initialProps);

	res.send(html);
})

app.get('/login', (req, res) => {

	const initialProps = JSON.stringify({});

	const context = {}

	const rts = renderToString(
		<StaticRouter location={req.url} context={context}>
			<Login />
		</StaticRouter>
	);

	const html = renderPage(rts, initialProps);

	res.send(html);
})

app.get('/register', (req, res) => {

	const initialProps = JSON.stringify({});

	const context = {}

	const rts = renderToString(
		<StaticRouter location={req.url} context={context}>
			<Register />
		</StaticRouter>
	);

	const html = renderPage(rts, initialProps);

	res.send(html);
})

app.get('/Tickets/new', (req, res) => {

	const initialProps = JSON.stringify({});

	const context = {}

	const rts = renderToString(
		<StaticRouter location={req.url} context={context}>
			<AddTicket />
		</StaticRouter>
	);

	const html = renderPage(rts, initialProps);

	res.send(html);
})


app.get('/ticket/:id', (req, res) => {

	const { id } = req.params;

	const initialProps = JSON.stringify({});

	const context = {}

	const rts = renderToString(
		<StaticRouter location={req.url} context={context}>
			<UpdateTicket id={id} />
		</StaticRouter>
	);

	const html = renderPage(rts, initialProps);

	res.send(html);
})




// You need to change the certificate an key to your own certificate and key
var key = fs.readFileSync('./ssl/localhost.key');
var cert = fs.readFileSync('./ssl/localhost.crt');

// creates the HTTP server to redirect to HTTPS
http.createServer(function (req, res) {
	res.writeHead(301, { "Location": "https://localhost:8081" + req.url });
	res.end();
}).listen(8080);

https.createServer({
	key: key,
	cert: cert
}, app).listen(8081, '0.0.0.0', function () {
	console.log(colors.yellow.bold('Server started: https://localhost:8081/'));
});