
self.addEventListener('message', function(e) {

    function connect(url) {

        self.web_sock = new WebSocket(url);

    }

    function send(data) {

        self.web_sock.send(data);

    }

    console.log("I am a worker");

    var data = JSON.parse(e.data)

    switch (data['type']) {

        case 'url': 
            connect(data['url']);
            break;

        case 'send':
            send(data['data']);
            break;
    };
}, false);
