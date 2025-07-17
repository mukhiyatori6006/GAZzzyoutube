// Streeam Me Devloper Bloggers.web.id - Authentication Middleware for Cloudflare Worker

export async function authenticate(request, env, ctx) {
  // Simple authentication check for Cloudflare Worker
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return new Response(JSON.stringify({
      error: 'Authentication required',
      message: 'Please provide Authorization header'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Basic token validation (in production, use proper JWT validation)
  const token = authHeader.replace('Bearer ', '');
  
  if (!token || token.length < 10) {
    return new Response(JSON.stringify({
      error: 'Invalid token',
      message: 'Please provide a valid authentication token'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Token is valid, continue with request
  return null;
}

export function requireAuth(handler) {
  return async (request, env, ctx) => {
    const authResult = await authenticate(request, env, ctx);
    if (authResult) {
      return authResult;
    }
    
    return handler(request, env, ctx);
  };
}