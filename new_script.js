const homeUrl = "/";
// let сompanies;
let originalCompanies;

// fetchForDb({
// 	mode: "read",
// 	arr: {
// 		id: undefined,
// 		name: undefined,
// 		own_earnings: undefined,
// 		mother: undefined,
// 		new_name: undefined,
// 		new_earnings: undefined
// 	}
// })


function fetchForDb(data) {
	data = JSON.stringify(data)
	let response = fetch(homeUrl, {
			method: "post",
			body: data
		})
		.then(response => {
			return response;
		})
		.then(res => {
			return res.body
				.getReader()
				.read()
				.then(done => {
					return new TextDecoder("utf-8").decode(done.value);
				});
		})
		.then(res => {
			let companies = JSON.parse(res);
			originalCompanies = companies;
		});
	return response
}

$(() => {
	let fetchPromise =
		fetchForDb({
			mode: 'read'
		})
		.then((res) => {
			console.log(res);
		})
})