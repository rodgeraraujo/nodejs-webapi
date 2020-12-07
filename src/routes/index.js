const HeroFactory = require('../factories/heroFactory');
const heroService = HeroFactory.generateInstance();
const Hero = require('../entities/hero');

const { handleError } = require('../exceptions');

const routes = {
  '/heroes:get': async (request, response) => {
    const { id } = request.queryString;
    const heroes = await heroService.find(id);

    response.write(JSON.stringify({ results: heroes }));

    return response.end();
  },
  '/heroes:post': async (request, response) => {
    // async iterator
    for await (const data of request) {
      try {
        const item = JSON.parse(data);
        const hero = new Hero(item);
        const { error, valid } = hero.isValid();

        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER);
          response.write(JSON.stringify({ error: error.join(',') }));
          return response.end();
        }

        const id = await heroService.create(hero);
        response.writeHead(201, DEFAULT_HEADER);
        response.write(JSON.stringify({ success: 'User created with success', id }));

        return response.end();
      } catch (error) {
        return handleError(response)(error);
      }
    }
  },
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: 'Not Found' }));
    return response.end();
  },
};

module.exports = { routes };
