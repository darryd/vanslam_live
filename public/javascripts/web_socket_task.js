
self.addEventListener('message', function(e) {

    function connect() {

        self.web_sock = new WebSocket(self.url);
		web_sock.onmessage = function(message) {
			self.postMessage({type: 'message', data: message.data});
		};
		web_sock.onopen = function() {
			self.web_sock.send(JSON.stringify({
				type: 'subscribe',
				competition_id: self.competition_id
			}));

			self.postMessage({type: 'connected'});
		};

		web_sock.onclose = function() {
			keep_trying_to_connect();
		};

		web_sock.onerror = function() {
			keep_trying_to_connect();
		};

	}

	function keep_trying_to_connect() {

		var interval = 100;

		var interval_id = setInterval(function(){

			if (self.web_sock.readyState == WebSocket.CLOSING || self.web_sock.readyState == WebSocket.CLOSED) {
				connect_websocket();
			}
			else {
				clearInterval(interval_id);
			}

		}, interval);
	}

	function send(data) {

		self.web_sock.send(data);

	}

	var data = e.data;

	switch (data['type']) {

		case 'url': 

			self.url = data.url;
			self.competition_id = data.competition_id;

			connect();
			keep_trying_to_connect();
			break;

		case 'send':
			send(data.data);
			break;
	};
}, false);
