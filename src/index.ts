import { Hono } from 'hono';

const app = new Hono<{ Bindings: Bindings }>();

// Music route
app.get('/music', (c) => {
  return c.text('🎵 Welcome to the Music App!');
});

// Calendar route
app.get('/calendar', (c) => {
  return c.text('🗓️ Welcome to the Calendar App!');
});

// Task route
app.get('/tasks', (c) => {
  return c.text('✅ Welcome to the Task App!');
});

export default app;
