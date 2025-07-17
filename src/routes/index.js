// Streeam Me Devloper Bloggers.web.id - Main Router for Cloudflare Worker

import { handleCors } from '../utils/cors.js';
import { handleHealthCheck } from '../worker-handler.js';

class Router {
  constructor() {
    this.routes = new Map();
  }

  get(path, handler) {
    this.routes.set(`GET:${path}`, handler);
  }

  post(path, handler) {
    this.routes.set(`POST:${path}`, handler);
  }

  put(path, handler) {
    this.routes.set(`PUT:${path}`, handler);
  }

  delete(path, handler) {
    this.routes.set(`DELETE:${path}`, handler);
  }

  async handle(request, env, ctx) {
    // Handle CORS preflight requests
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const routeKey = `${method}:${path}`;

    // Check for exact route match
    if (this.routes.has(routeKey)) {
      const handler = this.routes.get(routeKey);
      return await handler(request, env, ctx);
    }

    // Check for parametrized routes
    for (const [route, handler] of this.routes.entries()) {
      const [routeMethod, routePath] = route.split(':');
      if (routeMethod === method && this.matchRoute(routePath, path)) {
        return await handler(request, env, ctx);
      }
    }

    // 404 Not Found
    return new Response(JSON.stringify({
      error: 'Not Found',
      message: `Route ${method} ${path} not found`
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  matchRoute(routePath, requestPath) {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');

    if (routeParts.length !== requestParts.length) {
      return false;
    }

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        continue; // Parameter match
      }
      if (routeParts[i] !== requestParts[i]) {
        return false;
      }
    }

    return true;
  }
}

export const router = new Router();

// Define routes
router.get('/', async (request, env, ctx) => {
  return new Response(JSON.stringify({
    message: 'Welcome to Streeam Me Devloper Bloggers.web.id',
    version: '2.0.0',
    platform: 'Cloudflare Workers'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

router.get('/health', handleHealthCheck);

// API routes
router.get('/api/streams', async (request, env, ctx) => {
  // Handle stream listing
  return new Response(JSON.stringify({
    streams: [],
    message: 'Stream listing functionality'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

router.post('/api/streams', async (request, env, ctx) => {
  // Handle stream creation
  return new Response(JSON.stringify({
    message: 'Stream creation functionality'
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

router.get('/api/videos', async (request, env, ctx) => {
  // Handle video listing
  return new Response(JSON.stringify({
    videos: [],
    message: 'Video listing functionality'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});