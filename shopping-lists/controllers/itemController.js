import * as itemService from '../services/itemService.js'
import { redirectTo } from '../utils/utils.js'
import * as helpers from './helpers.js'

// change value of the "collected" attribute of item with id provided as a parameter to TRUE
const markItemCollected = async (request) => {
	const id = helpers.items_id_returner(request)
	const list_id = helpers.list_id_returner(request)
	await itemService.updateCollected(id)
	return redirectTo('/lists/' + list_id)
}

// adds item to the specific list
const addItem = async (request) => {
	const id = helpers.list_id_returner(request)
	const formData = await request.formData()
	const name = formData.get('name')
	await itemService.insertItem(name, id)
	return redirectTo('/lists/' + id)
}

export { markItemCollected, addItem }
