const moment = require("moment")

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
	pingTimeout: 30000,
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

httpServer.listen(31173);

// Socket.io listener
io.on('connection', function (socket) { 
	console.log(`New socket connection: ${moment().format()} - ${socket.client.conn.remoteAddress}`); 

	let timeProjection = {
		_id: false,
		updated_at: false,
		__v: false
	}

	let tickTimesV5Model = require('./models/tick_times_v5')
	tickTimesV5Model.find({}, timeProjection).
		sort({ time: -1 }).
		limit(1).
		lean().
		exec((err, res) => {
			if (!res) {
				return "No tick data"
			}
			if (err) {
				return "Error performing getLastTick()"
			}
			socket.send(res[0].time)
		})
});

