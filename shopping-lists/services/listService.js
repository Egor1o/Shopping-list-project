import { sql } from '../database.js'
// finds all lists where "active" attribute is true
const findAllActive = async () => {
	return await sql`SELECT * FROM shopping_lists WHERE active = TRUE`
}

// creates list with the name given in params
const createList = async (l_name) => {
	await sql`INSERT INTO shopping_lists (name) VALUES (${l_name})`
}

// deactivates list with params id
const deactivation = async (id) => {
	await sql`UPDATE shopping_lists SET active = FALSE WHERE id = ${id}`
}

const deleteListsAndItems = async () => {
	await sql`DELETE FROM shopping_list_items`
	await sql`DELETE FROM shopping_lists`
}

const getName = async (id) => {
	const query = await sql`SELECT name FROM shopping_lists WHERE id = ${id}`
	return await query.pop().name
}

export { findAllActive, createList, deactivation, deleteListsAndItems, getName }
