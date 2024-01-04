const request = require('supertest');
const { app } = require('../src/server');

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
