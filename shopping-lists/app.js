import * as itemController from './controllers/itemController.js'
import * as listController from './controllers/listController.js'
import * as statisticController from './controllers/mainPageController.js'
import { serve } from './deps.js'
import * as utils from './utils/utils.js'

const handleRequest = async (request) => {
	const url = new URL(request.url)
	if (request.method === 'GET' && url.pathname.startsWith('/delete')) {
		return await listController.deletes()
	} else if (
		request.method === 'POST' &&
		url.pathname.match('/lists/[0-9]+/items/[0-9]+/collect')
	) {
		return await itemController.markItemCollected(request)
	} else if (
		request.method === 'POST' &&
		url.pathname.match('/lists/[0-9]+/deactivate')
	) {
		return await listController.deactivateList(request)
	} else if (
		request.method === 'GET' &&
		url.pathname.match('/lists/[0-9]+')
	) {
		return await listController.openList(request)
	} else if (
		request.method === 'POST' &&
		url.pathname.match('/lists/[0-9]+/items')
	) {
		return await itemController.addItem(request)
	} else if (request.method === 'POST' && url.pathname.match('/lists')) {
		return await listController.addList(request)
	} else if (request.method === 'GET' && url.pathname === '/lists') {
		return await listController.activeLists()
	} else if (request.method === 'GET' && url.pathname === '/') {
		return await statisticController.showStatistics()
	} else {
		return utils.redirectTo('/')
	}
}

serve(handleRequest, { port: 7777 })
