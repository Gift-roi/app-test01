const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('GET /health renvoie 200', async () => {
  const s = app.listen(0);
  const r = await fetch(`http://localhost:${s.address().port}/health`);
  assert.equal(r.status, 200);
  s.close();
});
