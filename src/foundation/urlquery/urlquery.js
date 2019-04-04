export let updateQueryStringParameter = (key, value) => {
	let baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
	let urlQueryString = document.location.search;
	let newParam = key + '=' + value;
	let params = '?' + newParam;

	if (urlQueryString) {
		let updateRegex = new RegExp('([\?&])' + key + '[^&]*');
		let removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

		if (typeof value == 'undefined' || value == null || value == '' ) {
			params = urlQueryString.replace(removeRegex, "$1");
			params = params.replace( /[&;]$/, "" );
		} else if (urlQueryString.match(updateRegex) !== null) {
			params = urlQueryString.replace(updateRegex, "$1" + newParam);
		} else {
			params = urlQueryString + '&' + newParam;
		}
	}

	window.history.replaceState({}, "", baseUrl + params);
}

export let getQueryParameters = () => {
	let url = window.location.href;
	let params = {};
	let parser = document.createElement('a');
	parser.href = url;
	let query = parser.search.substring(1);
	let vars = query.split('&');

	if (query == '') {
		return null;
	}

	for (var i = 0; i < vars.length; i++) {
		let pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}

	return params;
}