## Steps to run this proyect

1. Run `npm install`.
2. Import SQL tables from sql/tables.sql to your DB.
3. Change SQL host, username, password and database in [server.js](https://github.com/fperich/saltala-react-node-mysql/server.js) file in root directory.
4. Run `npm start` to build and start the server.
5. Go to http://localhost:8080 or https://localhost:8081

This proyect is made in React with SSR, react-router, Node with Express for routing and api, MySql for database, express-session to manage user logged user.


The only user added to database is:

name: Administrator
email: admin@admin.cl
pass: 123
