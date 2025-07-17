var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/utils/cors.js
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400"
};
function handleCors(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  return null;
}
__name(handleCors, "handleCors");

// src/routes/index.js
var Router = class {
  static {
    __name(this, "Router");
  }
  constructor() {
    this.routes = /* @__PURE__ */ new Map();
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
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const routeKey = `${method}:${path}`;
    if (this.routes.has(routeKey)) {
      const handler = this.routes.get(routeKey);
      return await handler(request, env, ctx);
    }
    for (const [route, handler] of this.routes.entries()) {
      const [routeMethod, routePath] = route.split(":");
      if (routeMethod === method && this.matchRoute(routePath, path)) {
        return await handler(request, env, ctx);
      }
    }
    return new Response(JSON.stringify({
      error: "Not Found",
      message: `Route ${method} ${path} not found`
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  matchRoute(routePath, requestPath) {
    const routeParts = routePath.split("/");
    const requestParts = requestPath.split("/");
    if (routeParts.length !== requestParts.length) {
      return false;
    }
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        continue;
      }
      if (routeParts[i] !== requestParts[i]) {
        return false;
      }
    }
    return true;
  }
};
var router = new Router();
router.get("/", async (request, env, ctx) => {
  return new Response(JSON.stringify({
    message: "Welcome to Streeam Me Devloper Bloggers.web.id",
    version: "2.0.0",
    platform: "Cloudflare Workers"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
});
router.get("/health", handleHealthCheck);
router.get("/api/streams", async (request, env, ctx) => {
  return new Response(JSON.stringify({
    streams: [],
    message: "Stream listing functionality"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
});
router.post("/api/streams", async (request, env, ctx) => {
  return new Response(JSON.stringify({
    message: "Stream creation functionality"
  }), {
    status: 201,
    headers: {
      "Content-Type": "application/json"
    }
  });
});
router.get("/api/videos", async (request, env, ctx) => {
  return new Response(JSON.stringify({
    videos: [],
    message: "Video listing functionality"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
});

// src/worker-handler.js
async function handleRequest(request, env, ctx) {
  try {
    const response = await router.handle(request, env, ctx);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error("Worker error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
__name(handleRequest, "handleRequest");
async function handleHealthCheck() {
  return new Response(JSON.stringify({
    status: "healthy",
    service: "Streeam Me Devloper Bloggers.web.id",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleHealthCheck, "handleHealthCheck");

// worker.js
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
addEventListener("scheduled", (event) => {
  event.waitUntil(handleScheduledTasks(event.scheduledTime));
});
async function handleScheduledTasks(scheduledTime) {
  console.log("Scheduled task executed at:", scheduledTime);
}
__name(handleScheduledTasks, "handleScheduledTasks");
var worker_default = {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
  async scheduled(event, env, ctx) {
    return handleScheduledTasks(event.scheduledTime);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-plnrbf/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-plnrbf/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
