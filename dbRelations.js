const mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'serhii',
	database: 'eliftech'
});

connection.connect((err) => {
	if (err) throw err;
	console.log(`${new Date().getHours()}:${new Date().getMinutes()}  just to DB`);


	// let q = queryGenerator(code = 'edit', {
	// 	// id: 0,
	// 	name: 'loliscimo',
	// 	own_earnings: undefined,
	// 	mother: undefined,
	// 	new_name: undefined,
	// 	new_earnings: undefined
	// })
	// console.log(q);

	connection.query(q, (err, result) => {
		if (err) throw err;
		console.log(result);
	})
})

function queryGenerator(code, arr = new Object()) {
	if (arr.id == undefined) {
		arr.id = 'NULL'
	};
	if (arr.mother == undefined) {
		arr.mother == 'NULL'
	}
	switch (code) {
		case 'read':
			return `SELECT * FROM company`;
			break;
		case 'add':
			return `INSERT INTO company (name, own_earnings, mother) VALUES ('${arr.name}',${arr.own_earnings},'${arr.mother}')`;
			break;
		case 'edit':
			if (arr.new_name != undefined && arr.new_earnings != undefined) {
				return ` UPDATE company SET own_earnings = ${arr.new_earnings} WHERE id = ${arr.id} OR name = '${arr.name}'; UPDATE company SET name = '${arr.new_name}' WHERE id = ${arr.id} OR name = '${arr.name}'`
			} else if (arr.new_name != undefined) {
				return `UPDATE company SET name = '${arr.ew_name}' WHERE id = ${arr.id} OR name = '${arr.name}'`;
			} else if (arr.new_earnings != undefined) {
				return `UPDATE company SET own_earnings = ${arr.new_earnings} WHERE id = ${arr.id} OR name = '${arr.name}'`;
			}
			return queryGenerator('read', );
			break;
		case 'delete':
			return `DELETE FROM company WHERE name = '${arr.name}' OR id = ${arr.id} OR mother = '${arr.mother}'`
			break;
		default:
			return queryGenerator('read');
			break;
	}
}