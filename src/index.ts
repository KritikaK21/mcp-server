import { Hono } from 'hono';

const app = new Hono();

// Root route
app.get('/', (c) => {
  return c.text('👋 Welcome to the MCP server! Try /music, /calendar, or /tasks');
});

// Music route
app.get('/music', (c) => {
  return c.json([
    { title: "Blinding Lights", artist: "The Weeknd" },
    { title: "Levitating", artist: "Dua Lipa" },
    { title: "Peaches", artist: "Justin Bieber" }
  ]);
});

// Calendar route
app.get('/calendar', (c) => {
  return c.json([
    { event: "Team Meeting", date: "2025-08-10", time: "10:00 AM" },
    { event: "Code Review", date: "2025-08-11", time: "2:00 PM" }
  ]);
});

// Tasks route
app.get('/tasks', (c) => {
  return c.json([
    { task: "Complete MCP Submission", status: "Pending" },
    { task: "Record Demo Video", status: "In Progress" },
    { task: "Submit GitHub Link", status: "Done" }
  ]);
});

export default app;

app.get('/api/trigger-n8n', async (c) => {
const webhookUrl = 'https://kritika22.app.n8n.cloud/webhook/2d1a2a0a-a8b4-4d7c-b606-bf2551086870';

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Hello from MCP via Cloudflare Worker!',
      timestamp: new Date().toISOString()
    })
  });

  return c.text(`n8n Webhook triggered. Response status: ${response.status}`);
});
