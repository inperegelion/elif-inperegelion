const homeUrl = "/";
let allCompanies;
let originalCompanies;

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
			allCompanies = JSON.parse(res);
			originalCompanies = allCompanies;
		});
	return response
}
$(() => {

	fetchForDb({
			mode: "read"
		})
		.then(() => {

			allCompanies.map((row) => {
				row.html = `<li id = '${row.name}'><span class="changeableName btn">${row.name}</span> | own: <span class="changeableEarnings btn">${row.own_earnings}</span> | total: <span class="totalEarnings btn"></span><button class="addButton">add</button><button class="delButton">del</button><ul id = '${row.name}-childs'></ul></li>`;
				if (row.mother == null || row.mother == undefined || row.mother == 'undefined') {
					$('#mother-companies').append(row.html)
				} else {
					row.motherID = `#${row.mother}-childs`
					$(row.motherID).append(row.html);
				}
			})
			plugInteraction()
		})
})

function plugInteraction(mode) {
	switch (mode) {
		case 'doAdd':
			$('.doAdd').on('click', event => {

				if (Number($(event.currentTarget).siblings('.addedEarnings').val()) != NaN &&
					isUnique($(event.currentTarget).siblings('.addedName').val(), allCompanies)) {
					let temp = {
						name: $(event.currentTarget).siblings('.addedName').val(),
						own_earnings: Number($(event.currentTarget).siblings('.addedEarnings').val()),
						mother: $(event.currentTarget).parent().parent().attr('id').split('-')[0],
					}
					temp.html = `<li id = '${temp.name}'><span class="changeableName btn">${temp.name}</span> | own: <span class="changeableEarnings btn">${temp.own_earnings}</span> | total: <span class="totalEarnings btn"></span><button class="addButton-newby">add</button><button class="delButton-newby">del</button><ul id = '${temp.name}-childs'></ul></li>`;
					temp.motherID = `#${temp.mother}-childs`
					allCompanies.push(temp);
					$(event.currentTarget).parent().after(temp.html).remove();

					plugInteraction(mode = 'newby');
				} else {
					$(event.currentTarget).siblings().css({
						color: 'red'
					})
				}
			})
			break;

		case 'newby':
			$('.delButton-newby').on('click', (event) => {
				$(event.currentTarget).parent().remove()
			})

			$('.addButton-newby').on('click', (event) => {
				$(event.currentTarget).siblings('ul').append('<li><input class="addedName" placeholder="new name?"></input><input class="addedEarnings" placeholder="own earnings?"></input><button class="doAdd">+</button></li>')
				plugInteraction(mode = 'doAdd')
			})

			$('.addButton-newby').toggleClass('.addButton-newby .addButton');
			$('.delButton-newby').toggleClass('.delButton-newby .delButton');

			break;

		default:
			$('.delButton').on('click', (event) => {
				$(event.currentTarget).parent().remove()
			})

			$('.addButton').on('click', (event) => {
				$(event.currentTarget).siblings('ul').append('<li><input class="addedName" placeholder="new name?"></input><input class="addedEarnings" placeholder="own earnings?"></input><button class="doAdd">+</button></li>')
				plugInteraction(mode = 'doAdd')
			})

			break;
	}
}

function isUnique(newName, companiesList) {
	let temp = true;
	companiesList.map((row) => {
		if (newName == row.name) {
			console.log('NOT UNIQUE!');
			temp = false
		}
	})
	return temp
}