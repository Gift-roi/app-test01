const express = require('express');
const client = require('prom-client');
const app = express();

client.collectDefaultMetrics();
const httpCounter = new client.Counter({
  name: 'http_requests_total', help: 'Total requetes HTTP',
  labelNames: ['method', 'route', 'status'],
});
app.use((req, res, next) => {
  res.on('finish', () => httpCounter.inc({ method: req.method, route: req.path, status: res.statusCode }));
  next();
});

app.get('/', (req, res) => res.send('<h1>AURA - version 1</h1>'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
if (require.main === module) app.listen(3000, () => console.log('App sur :3000'));