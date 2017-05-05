function get_xmlhttp() {

	var xmlhttp;
	if (XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	return xmlhttp;
}


self.addEventListener('message', function(e) {

	var xmlhttp = get_xmlhttp(); 

	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			self.postMessage(xmlhttp.responseText);
		}
	};

	xmlhttp.open("POST", e.data.url, true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(e.data.data);

}, false);
