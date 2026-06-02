import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { connectDB } from '../src/db';
import User from '../src/models/User';
import Application from '../src/models/Application';
import Organization from '../src/models/Organisation';
import { Animal } from '../src/models/animal';

const TEST_EMAIL = 'jest_contacttest@example.com';
const TEST_PASSWORD = 'TestPassword123';
const TEST_USERNAME = 'jest_contactuser';
const TEST_ORG_EMAIL = 'jest_testorg@example.com';
const TEST_ORG_NAME = 'jest_testorg';

let token: string;
let applicationId: string;

beforeAll(async () => {
  await connectDB();

  await User.deleteOne({ email: TEST_EMAIL });
  await Organization.deleteOne({ organization: TEST_ORG_NAME });
  await Application.deleteMany({ motivation: 'jest-test-contact' });
  await Animal.deleteMany({ name: 'Testdjur' });

  await request(app).post('/api/users/register').send({
    username: TEST_USERNAME,
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    role: 'adopter',
  });

  const loginRes = await request(app).post('/api/users/login').send({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  token = loginRes.body.token;

  const org = await Organization.create({
    email: TEST_ORG_EMAIL,
    organization: TEST_ORG_NAME,
    password: 'hashedpassword',
    role: 'organization',
  });

  const animal = await Animal.create({
    name: 'Testdjur',
    type: 'Hund',
    breed: 'Testras',
    image: 'https://example.com/test.jpg',
    age: 2,
    keyTraits: 'Snäll',
    city: 'Kristianstad',
    organizationOwner: TEST_ORG_NAME,
    childFriendly: false,
    likes: [],
  });

  const user = await User.findOne({ email: TEST_EMAIL });

  const application = await Application.create({
    userId: user!._id,
    animalId: animal._id,
    housingType: 'lagenhet',
    housingSize: 50,
    hasAnimalExperience: true,
    hasChildren: false,
    hasAllergies: false,
    motivation: 'jest-test-contact',
    gdprConsent: true,
    status: 'Godkänd',
  });
  applicationId = application.id;
});

afterAll(async () => {
  await User.deleteOne({ email: TEST_EMAIL });
  await Organization.deleteOne({ organization: TEST_ORG_NAME });
  await Application.deleteMany({ motivation: 'jest-test-contact' });
  await Animal.deleteMany({ name: 'Testdjur' });
  await mongoose.disconnect();
});

describe('GET /api/applications/:id/organisation-contact', () => {
  it('ska returnera 401 utan token', async () => {
    const res = await request(app).get(`/api/applications/${applicationId}/organisation-contact`);
    expect(res.statusCode).toBe(401);
  });

  it('ska returnera 404 för ogiltigt id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/applications/${fakeId}/organisation-contact`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('ska returnera organisationens kontaktinfo för godkänd ansökan', async () => {
    const res = await request(app)
      .get(`/api/applications/${applicationId}/organisation-contact`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
  });
});
