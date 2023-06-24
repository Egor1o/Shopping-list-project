import { sql } from '../database.js'

const numberOfLists = async () => {
	const query = await sql`SELECT COUNT(*) as lists FROM shopping_lists`
	return await query.pop().lists
}

const numberOfItems = async () => {
	const query = await sql`SELECT COUNT(*) as items FROM shopping_list_items`
	return await query.pop().items
}

export { numberOfItems, numberOfLists }
