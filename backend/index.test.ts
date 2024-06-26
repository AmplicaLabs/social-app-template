import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './index.js';

describe('API', () => {
  it('GET /unknown returns 404', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.text).toContain('Error');
  });
});
