const express = require("express");
// const fs = require("fs");
const { ExpressPeerServer } = require("peer");

const app = express();

const server = app.listen(9000);

const peerServer = ExpressPeerServer(server, {
	// ssl: {
	// 	key: fs.readFileSync("./localhost.dev.key"),
	// 	cert: fs.readFileSync("./localhost.dev.crt"),
	// },
});

app.use("/web-peer", peerServer);

