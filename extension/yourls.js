function YOURLS(settings, options, expected) {
    var expMatchString = expected || '^\\s*(\\S+)\\s*$';
    var apiURL = settings.api;
    if (apiURL.substr(-1) != '/') apiURL += '/';
    apiURL += 'yourls-api.php';
    var qParams = '';
    for (var k in options) {
	if (options.hasOwnProperty(k)) {
	    if (qParams.length) qParams += '&';
	    qParams += k + '=' + encodeURIComponent(options[k]);
	}
    }
    return new Promise((resolve, reject) => {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', apiURL);
	xhr.setRequestHeader('Content-type',
			     'application/x-www-form-urlencoded');
	var rqTimer = setTimeout(
	    function() {
		xhr.abort();
		reject(new Error('Timed out'));
	    }, (parseInt(settings.maxwait) || 30) * 1000
	);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
		clearTimeout(rqTimer);
		if ((xhr.status == 200) || (xhr.status == 201)) {
		    var uMatch = xhr.responseText.
			match(new RegExp(expMatchString));
		    if (uMatch) {
			resolve(uMatch[1]);
		    } else {
			reject(new Error('Invalid: ' + xhr.responseText));
		    }
		} else {
		    reject(new Error('Error ' + xhr.status));
		}
	    }
	};
	xhr.send(qParams);
    });
}
