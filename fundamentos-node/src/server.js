import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// Query parameters: URL Stateful => filtros, paginação, busca, não-obrigatórios
//localhost:3333/users?userId=1&name="alessander"

// Route parameters: Geralmente para identificação de recurso
//localhost:3333/users/1

// Request body: Envio de informações de formulários (HTTPs)


const server = http.createServer(async (req, res) => {
  const { method, url } = req

  //middleware intercepta e manipulam a requisição e a resposta de uma rota
  await json(req, res)

  const route = routes.find(route => {
    return route.method == method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})




server.listen(3333)