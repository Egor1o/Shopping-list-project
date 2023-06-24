import { sql } from '../database.js'

const getItems = async (id) => {
	return await sql`SELECT * FROM shopping_list_items WHERE shopping_list_id = ${id}
	ORDER BY collected ASC, name ASC`
}

const insertItem = async (name, id) => {
	await sql`INSERT INTO shopping_list_items (name, shopping_list_id)
     VALUES (${name}, ${id});`
}

const updateCollected = async (item_id) => {
	await sql`UPDATE shopping_list_items
		SET collected = TRUE
		WHERE id = ${item_id}`
}

export { getItems, insertItem, updateCollected }
