// Streeam Me Devloper Bloggers.web.id - Cloudflare Worker Handler
// Main request handler for Cloudflare Worker environment

import { router } from './routes/index.js';
import { corsHeaders } from './utils/cors.js';
import { authenticate } from './middleware/auth.js';

export async function handleRequest(request, env, ctx) {
  try {
    // Add CORS headers for all requests
    const response = await router.handle(request, env, ctx);
    
    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    console.error('Worker error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Health check endpoint
export async function handleHealthCheck() {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'Streeam Me Devloper Bloggers.web.id',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}