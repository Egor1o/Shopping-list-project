import { configure, renderFile } from '../deps.js'
import * as itemService from '../services/itemService.js'
import * as listService from '../services/listService.js'
import * as statistics from '../services/statisticsService.js'
import { redirectTo } from '../utils/utils.js'
import * as helpers from './helpers.js'

//adds a list element to the list of lists.
configure({
	views: `${Deno.cwd()}/layouts/`,
})

const responseDetails = {
	headers: { 'Content-Type': 'text/html;charset=UTF-8' },
}

const addList = async (request) => {
	const formData = await request.formData()
	const name = formData.get('name')
	await listService.createList(name)
	return redirectTo('/lists')
}

// returns the response with all active lists.
const activeLists = async () => {
	const data = {
		lists: await listService.findAllActive(),
		l_number: await statistics.numberOfLists(),
		i_number: await statistics.numberOfItems(),
	}
	return new Response(await renderFile('index.eta', data), responseDetails)
}

// deactivates list with id provided in the request params.
const deactivateList = async (request) => {
	const id = helpers.list_id_returner(request)
	await listService.deactivation(id)
	return redirectTo('/lists')
}

// returns a itemService of a list provided in request's parameters
const openList = async (request) => {
	const id = helpers.list_id_returner(request)
	const data = {
		items: await itemService.getItems(id),
		listId: id,
		name: await listService.getName(id),
	}
	return new Response(await renderFile('items.eta', data), responseDetails)
}

// implements deleteListsAndItems function (debugging)
const deletes = async () => {
	await listService.deleteListsAndItems()
	return redirectTo('/')
}

export { openList, activeLists, addList, deactivateList, deletes }
