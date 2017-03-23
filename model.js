export default (list) => ({
	model: {
		find: () => {
			debugger;
			return fetch(`/api/${list.toLowerCase()}`)
			.then(checkHttpStatus)
			.then(parseJSON);
		},
	},
});

function checkHttpStatus (response) {
	if (response.status === 200) {
		return response;
	}
	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

function parseJSON (response) {
	return response.json();
}
