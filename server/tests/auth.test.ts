import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { connectDB } from '../src/db';
import User from '../src/models/User';

const TEST_EMAIL = 'jest_testuser@example.com';
const TEST_PASSWORD = 'TestPassword123';
const TEST_USERNAME = 'jest_testuser';

beforeAll(async () => {
  await connectDB();
  await User.deleteOne({ email: TEST_EMAIL });
});

afterAll(async () => {
  await User.deleteOne({ email: TEST_EMAIL });
  await mongoose.disconnect();
});

describe('Auth endpoints', () => {
  describe('POST /api/users/register', () => {
    it('ska registrera en ny användare', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: TEST_USERNAME,
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          role: 'adopter',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
    });
  });

  describe('POST /api/users/login', () => {
    it('ska logga in en användare', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});
