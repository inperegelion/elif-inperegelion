const homeUrl = "/";
let a;
let lolo;


let myData = {
	mode: "read",
	arr: {
		id: undefined,
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
			if (row.mother == null || row.mother == "undefined") {
				temp[0] = `<li id = '${row.name}'><span class="changeableName btn">${row.name}</span> | own: <span class="changeableEarnings btn">${row.own_earnings}</span> | total: <span class="totalEarnings btn">${row.all_earnings}</span><ul id = '${row.name}-childs'></ul></li>`;
				$('#mother-companies').html(temp[0]);
			} else {
				temp[0] = `#${row.mother}-childs`;
				temp[1] = `<li id = '${row.name}'><span class="changeableName btn">${row.name}</span> | own: <span class="changeableEarnings btn">${row.own_earnings}</span> | total: <span class="totalEarnings btn">${row.all_earnings}</span><ul id = '${row.name}-childs'></ul></li>`;
				$(temp[0]).append(temp[1])
			}
		})
		$('.totalEarnings').after('<button class="delButton">del</button>')
		$('.delButton').on('click', (event) => {
			$(event.currentTarget).parent().remove()
		})
		$('.delButton').before('<button class="addButton">add</button>')
		$('.addButton').on('click', (event) => {
			$(event.currentTarget).parent().after('<li><input class="addedName" placeholder="new name?"></input><input class="addedEarnings" placeholder="own earnings?"></input><button class="doAdd">+</button></li>')
			$('.doAdd').on('click', ev => {
				if ($.isNumeric($(ev.currentTarget).siblings('.addedEarnings').val())) {

				}
				let temp = [];
				temp[0] = $(ev.currentTarget).siblings('.addedName').val();
				temp[1] = $(ev.currentTarget).siblings('.addedEarnings').val();
				$(ev.currentTarget).parent().after(`<li id = '${temp[0]}'><span class="changeableName btn">${temp[0]}</span> | own: <span class="changeableEarnings btn">${temp[1]}</span> | total: <span class="totalEarnings btn"></span><ul id = '${temp[0]}-childs'></ul></li>`);
				$(ev.currentTarget).parent().remove();
			})
		})

		// $('.addButton').parent().after(`<li id = '${row.name}'><span class="changeableName btn">${row.name}</span> | own: <span class="changeableEarnings btn">${row.own_earnings}</span> | total: <span class="totalEarnings btn">${row.all_earnings}</span><ul id = '${row.name}-childs'></ul></li>`)

		$('li .changeableEarnings')
			.map((i, elem) => {
				let temp = '';
				$(elem).on('click', (event) => {
					let $clicked = $(event.currentTarget);
					temp = `<input type='text' value='${$(event.currentTarget).text()}'></input><button class='checkMark'>✓</button>`;
					$(event.currentTarget).after(temp).hide()
					$('.checkMark').on('click', (ev) => {
						if ($.isNumeric($clicked.siblings('input').val())) {
							$clicked
								.show()
								.text($clicked.siblings('input').val())
								.siblings('input, button').remove();
						} else {
							$clicked.siblings('input').css({
								color: 'red'
							})
						}
					})
				})
			})
		$('li .changeableName')
			.map((i, elem) => {
				let temp = '';
				$(elem).on('click', (event) => {
					let $clicked = $(event.currentTarget);
					temp = `<input type='text' value='${$(event.currentTarget).text()}'></input><button class='checkMark'>✓</button>`;
					$(event.currentTarget).after(temp).hide()
					$('.checkMark').on('click', (ev) => {
						let temp = true;
						$('.changeableName').map((elem) => {
							temp = $(elem).text() != $clicked.siblings('input').val() && temp
						})
						if (temp) {
							$clicked
								.show()
								.text($clicked.siblings('input').val())
								.siblings('input, button').remove();
						} else {
							$clicked.siblings('input').css({
								color: 'red'
							})
						}
					})
				})
			})
	})
})