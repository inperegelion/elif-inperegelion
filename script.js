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
	$('h3').on('click', () => {
		doCalculations()
	})
	let promise = fetchForDb({
			mode: "read"
		})
		.then(() => {

			allCompanies.map((row) => {
				row.html = `<li id = '${row.name}'><span class="changeableName btn">${row.name}</span> | own: <span class="changeableEarnings btn">${row.own_earnings}</span> | total: <span class="totalEarnings btn"></span><button class="addButton btn">add</button><button class="delButton btn">del</button><ul id = '${row.name}-childs'></ul></li>`;
				if (row.mother == null || row.mother == undefined || row.mother == 'undefined') {
					$('#mother-companies').append(row.html)
				} else {
					row.motherID = `#${row.mother}-childs`
					$(row.motherID).append(row.html);
				}
				row.html = $('#' + row.name)
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
					temp.html = `<li id = '${temp.name}'><span class="changeableName btn">${temp.name}</span> | own: <span class="changeableEarnings btn">${temp.own_earnings}</span> | total: <span class="totalEarnings btn"></span><button class="addButton-newby btn">add</button><button class="delButton-newby btn">del</button><ul id = '${temp.name}-childs'></ul></li>`;
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
			doCalculations()
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
			doCalculations()
			break;

		case 'edition':

			$('.changeableEarnings').on('click', (event) => {
				let temp = $(event.currentTarget).text();

				$(event.currentTarget).after('<span><input class="changeOwnEarnings" placeholder="new earnings?"></input><button class="checkMark">✓</button><button class="xMark">x</button></span>');
				$(event.currentTarget).remove();

				$('.checkMark').on('click', (event) => {
					temp = $(event.currentTarget).siblings('input').val();
					if (Number(temp) != NaN) {
						allCompanies[findCompanyByName($(event.currentTarget).parent().parent().attr('id'), allCompanies)].own_earnings = parseInt(temp);
						temp = `<span class="changeableEarnings-newby btn">${temp}`;
						$(event.currentTarget).parent().before(temp);
						$(event.currentTarget).parent().remove()
						plugInteraction('edition-newby')
					} else {
						$(event.currentTarget).css({
							color: 'red'
						})
					}
				})
				$('.xMark').on('click', (event) => {
					temp = `<span class="changeableEarnings btn">${temp}<span> `;
					$(event.currentTarget).parent().before(temp);
					$(event.currentTarget).parent().remove()
				})
			})

			/////////////////////////////////////////////////
			$('.changeableName').on('click', (event) => {
				let temp = $(event.currentTarget).text();

				$(event.currentTarget).after('<span><input class="changeName" placeholder="new name?"></input><button class="checkMark">✓</button><button class="xMark">x</button></span>');
				$(event.currentTarget).remove();

				$('.checkMark').on('click', (event) => {
					temp = $(event.currentTarget).siblings('input').val();
					if (Number(temp) != NaN) {
						allCompanies[findCompanyByName($(event.currentTarget).parent().parent().attr('id'), allCompanies)].own_earnings = parseInt(temp);
						temp = `<span class="changeableName-newby btn">${temp}`;
						$(event.currentTarget).parent().before(temp);
						$(event.currentTarget).parent().remove()
						plugInteraction('edition-newby')
					} else {
						$(event.currentTarget).css({
							color: 'red'
						})
					}
				})
				$('.xMark').on('click', (event) => {
					temp = `<span class="changeableName btn">${temp}<span> `;
					$(event.currentTarget).parent().before(temp);
					$(event.currentTarget).parent().remove()
				})
			})

			/////////////////////////////////////////////////
			plugInteraction('edition-newby')

			break;
		case 'edition-newby':
			$('.changeableEarnings-newby').on('click', (event) => {
				let temp = $(event.currentTarget).text();

				$(event.currentTarget).after('<span><input class="changeOwnEarnings" placeholder="new earnings?"></input><button class="checkMark">✓</button><button class="xMark">x</button></span>');
				$(event.currentTarget).remove();

				$('.checkMark').on('click', (event) => {
					temp = $(event.currentTarget).siblings('input').val();
					if (Number(temp) != NaN) {
						allCompanies[findCompanyByName($(event.currentTarget).parent().parent().attr('id'), allCompanies)].own_earnings = parseInt(temp);
						temp = `<span class="changeableEarnings-newby btn">${temp}`;
						$(event.currentTarget).parent().before(temp);
						$(event.currentTarget).parent().remove()
						plugInteraction('edition-newby')
					} else {
						$(event.currentTarget).css({
							color: 'red'
						})
					}
				})
				$('.xMark').on('click', (event) => {
					temp = `<span class="changeableEarnings btn">${temp}<span> `;
					$(event.currentTarget).parent().before(temp);
					$(event.currentTarget).parent().remove()
				})
			})

			$('.changeableName').on('click', (event) => {
				let temp = $(event.currentTarget).text();

				$(event.currentTarget).after('<span><input class="changeName" placeholder="new name?"></input><button class="checkMark">✓</button><button class="xMark">x</button></span>');
				$(event.currentTarget).remove();

				$('.checkMark').on('click', (event) => {
					temp = $(event.currentTarget).siblings('input').val();
					if (Number(temp) != NaN) {
						allCompanies[findCompanyByName($(event.currentTarget).parent().parent().attr('id'), allCompanies)].name = parseInt(temp);
						temp = `<span class="changeableName-newby btn">${temp}`;
						$(event.currentTarget).parent().before(temp);
						$(event.currentTarget).parent().remove()
						plugInteraction('edition-newby')
					} else {
						$(event.currentTarget).css({
							color: 'red'
						})
					}
				})
				$('.xMark').on('click', (event) => {
					temp = `<span class="changeableName btn">${temp}<span> `;
					$(event.currentTarget).parent().before(temp);
					$(event.currentTarget).parent().remove()
				})
			})

			$('.changeableEarnings-newby').toggleClass('changeableEarnings-newby changeableEarnings');
			$('.changeableName-newby').toggleClass('changeableName-newby changeableName');
			doCalculations()
			break

		default:
			$('.delButton').on('click', (event) => {
				$(event.currentTarget).parent().remove()
			})

			$('.addButton').on('click', (event) => {
				$(event.currentTarget).siblings('ul').append('<li><input class="addedName" placeholder="new name?"></input><input class="addedEarnings" placeholder="own earnings?"></input><button class="doAdd btn">+</button></li>')
				plugInteraction(mode = 'doAdd')
			})

			plugInteraction('edition')
			doCalculations()
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

function findCompanyByName(name, companiesList) {
	let temp;
	companiesList.map((row, index) => {
		if (name == row.name) {
			temp = index;
		}
	})
	return temp;
}

function findCompanyByMother(mother, companiesList) {
	//returns array
	let temp = [];
	companiesList.map((row, index, arr) => {
		if (mother == row.mother) {
			temp.push(arr[index])
		}
	})
	return temp;
}

function calc(company) {
	let res = 0;
	company.childs.forEach(comp => {
		res += calc(comp)
	});
	return res + Number(company.own_earnings)
}

function doCalculations() {
	allCompanies.map((row, index, arr) => {
		row.childs = findCompanyByMother(row.name, arr)
	})
	allCompanies.forEach(company => {
		console.log(company.name, calc(company));
		company.html.children('.totalEarnings').html(calc(company))
	});
}


// allCompanies.map((row, index, arr) => {
// 	row.total = row.own_earnings;
// // 	row.mother = arr[findCompanyByName(row.mother, allCompanies)]
// // 	console.log(row.mother);
// // })

// allCompanies.map((row, index, arr) => {
// 	if (row.mother == null || row.mother == undefined) return row
// 	arr[findCompanyByName(row.mother, arr)].childs.push(row.name)
// })

// function kidSumm(elem) {
// }