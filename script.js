const homeUrl = "http://localhost:8085/";
let a;
let lolo;


let myData = {
	mode: "add",
	arr: {
		// id: 7,
		name: 'Romet',
		own_earnings: 205,
		mother: undefined,
		new_name: undefined,
		new_earnings: undefined
	}
};
// fetchForDb(myData)

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
			a = JSON.parse(res);
		});
	return response
}

$(() => {
	fetchForDb({
		mode: "read"
	}).then(() => {
		a.map(row => {
			let temp = [];
			if (row.mother == null) {
				temp[0] = `<li id = '${row.name}'><span>${row.name}</span> | own: <span class="own-earnings">${row.own_earnings}</span> | total: <span>${row.all_earnings}</span><ul id = '${row.name}-childs'></ul></li>`;
				$('#mother-companies').html(temp[0]);
			} else if (row.mother != null) {
				temp[0] = `#${row.mother}-childs`;
				temp[1] = `<li id = '${row.name}'><span>${row.name}</span> | own: <span class="own-earnings">${row.own_earnings}</span> | total: <span>${row.all_earnings}</span><ul id = '${row.name}-childs'></ul></li>`;
				$(temp[0]).append(temp[1])
			}
		})
		$('li span')
			.map((i, elem) => {
				let temp = '';
				$(elem).on('click', (event) => {
					console.log(event.currentTarget);
					
					temp = `<input type='text' value='${event.currentTarget.text}'></input><button >✓<button>`;
					event.currentTarget.after(temp)
				})
			})
	})
})