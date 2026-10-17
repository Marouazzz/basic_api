const request = require('supertest');
const app = require('../server'); // Importez votre application Express (sans le app.listen)

describe('GET /products', () => {
  it('devrait retourner la liste des produits avec un code 200', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
