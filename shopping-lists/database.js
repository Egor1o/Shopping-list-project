import { postgres } from './deps.js'

let sql = postgres({})
if (Deno.env.get('DATABASE_URL')) {
	sql = postgres(Deno.env.get('DATABASE_URL'))
} else {
	sql = postgres({})
}

export { sql }
//export { executeQuery }
