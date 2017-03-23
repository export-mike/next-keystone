export default list => {
	return class Model {
		static find () {
			return fetch(`/api/${list.toLowerCase()}`)
			.then(checkHttpStatus)
			.then(parseJSON);
		}
		static getById() {
			return fetch(`/api/${list.toLowerCase}/${id}`)
			.then(checkHttpStatus)
			.then(parseJSON);
		}

		constructor (props) {
			this.props = props;
		}

		save () {
			if (!this.props) return Promise.reject(`No props given to constructor of ${list} model, do this before calling .save()`);
			return fetch(`/api/${list.toLowerCase}`, {
				body: JSON.stringify(this.props),
				headers: {
					'content-type': 'application/json',
					'accept-type': 'application/json',
				},
			})
			.then(checkHttpStatus)
			.then(parseJSON);
		}
};

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
