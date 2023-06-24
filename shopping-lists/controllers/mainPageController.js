import { configure, renderFile } from '../deps.js'
import * as statistics from '../services/statisticsService.js'

configure({
	views: `${Deno.cwd()}/layouts/`,
})

const responseDetails = {
	headers: { 'Content-Type': 'text/html;charset=UTF-8' },
}

const showStatistics = async () => {
	const data = {
		l_number: await statistics.numberOfLists(),
		i_number: await statistics.numberOfItems(),
	}
	return new Response(
		await renderFile('statistics.eta', data),
		responseDetails
	)
}
export { showStatistics }
