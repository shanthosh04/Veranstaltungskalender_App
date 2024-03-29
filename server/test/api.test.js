const request = require('supertest');
const express = require('express');
const { initializeAPI } = require('../api');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');
const { executeSQL } = require('../database');
jest.mock('../database', () => ({
  executeSQL: jest.fn(),
}));

describe('API Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    initializeAPI(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      executeSQL.mockResolvedValue({ affectedRows: 1 });

      const newUser = {
        firstname: 'shanthosh',
        lastname: 'sivasenthinathan',
        birthdate: '2004-10-16',
        street: 'zieglerstrasse 67',
        zipcode: '3000',
        city: 'Bern',
        email: 'shanthosh@gmail.com',
        password: 'shanthosh',
      };

      const response = await request(app)
        .post('/api/register')
        .send(newUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(executeSQL).toHaveBeenCalledWith(expect.any(String), [
        newUser.firstname,
        newUser.lastname,
        newUser.birthdate,
        newUser.street,
        newUser.zipcode,
        newUser.city,
        newUser.email,
        newUser.password,
      ]);
    });
  });

  describe('POST /api/login', () => {
    it('should authenticate a user and return a token', async () => {
      const mockUser = {
        id: 1,
        email: 'shanthosh@gmail.com',
        password: 'shanthosh',
      };

      executeSQL.mockResolvedValue([mockUser]);

      const mockToken = 'fake.jwt.token';
      jwt.sign.mockReturnValue(mockToken);

      const loginDetails = {
        email: 'shanthosh@gmail.com',
        password: 'shanthosh',
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginDetails);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ token: mockToken });
      expect(executeSQL).toHaveBeenCalledWith(expect.any(String), [
        loginDetails.email,
        loginDetails.password,
      ]);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        expect.any(String),
        { expiresIn: '1h' }
      );
    });

  });
  describe('POST /api/event', () => {
    it('should create an event successfully', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { userId: 1 });
      });
  
      executeSQL.mockResolvedValue({ affectedRows: 1 });
  
      const newEvent = {
        title: 'school',
        date: '2024-02-11',
        description: 'schoolstart',
      };
  
      const response = await request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer fake.jwt.token')
        .send(newEvent);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(executeSQL).toHaveBeenCalledWith(expect.any(String), [
        expect.any(Number),
        newEvent.title,
        newEvent.date,
        newEvent.description,
      ]);
    });
  });

  describe('PUT /api/event/:eventId', () => {
    it('should update an event successfully', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { userId: 1 });
      });
  
      executeSQL.mockResolvedValue({ affectedRows: 1 });
  
      const updatedEvent = {
        title: 'schule',
        date: '2024-02-12',
        description: '2. Semester start',
      };
  
      const response = await request(app)
        .put('/api/event/1') 
        .set('Authorization', 'Bearer fake.jwt.token')
        .send(updatedEvent);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(executeSQL).toHaveBeenCalledWith(expect.any(String), [
        updatedEvent.title,
        updatedEvent.date,
        updatedEvent.description,
        '1',
        expect.any(Number),
      ]);
    });
  });
  
  describe('DELETE /api/event/:eventId', () => {
    it('should delete an event successfully', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { userId: 1 });
      });
  
      executeSQL.mockResolvedValue({ affectedRows: 1 });
  
      const response = await request(app)
        .delete('/api/event/1')
        .set('Authorization', 'Bearer fake.jwt.token');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(executeSQL).toHaveBeenCalledWith(expect.any(String), [
        '1',
        expect.any(Number),
      ]);
    });
  });  
  
});
