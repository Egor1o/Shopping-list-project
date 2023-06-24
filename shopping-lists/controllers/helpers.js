const list_id_returner = (request) => {
	const url = new URL(request.url)
	const params = url.pathname.split('/')
	return params[2]
}

const items_id_returner = (request) => {
	const url = new URL(request.url)
	const params = url.pathname.split('/')
	return params[4]
}

export { list_id_returner, items_id_returner }
