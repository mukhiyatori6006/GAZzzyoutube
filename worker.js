// Streeam Me Devloper Bloggers.web.id - Cloudflare Worker Entry Point

import { handleRequest } from './src/worker-handler.js';

// Main event listener for fetch requests
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// Cron trigger for scheduled tasks
addEventListener('scheduled', event => {
  event.waitUntil(handleScheduledTasks(event.scheduledTime));
});

// Handle scheduled streaming tasks
async function handleScheduledTasks(scheduledTime) {
  // Check for scheduled streams
  // Monitor active streams
  // Cleanup expired data
  console.log('Scheduled task executed at:', scheduledTime);
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
  
  async scheduled(event, env, ctx) {
    return handleScheduledTasks(event.scheduledTime);
  }
};