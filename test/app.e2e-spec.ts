import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Role } from '../src/users/enums/role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email,
          password,
          roles: [Role.CLIENT],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toEqual(email);
          
          jwtToken = res.body.accessToken;
          userId = res.body.user.id;
        });
    });

    it('should login with registered credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toEqual(email);
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Projects', () => {
    let projectId: string;

    it('should create a project', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Test Project',
          description: 'This is a test project',
          budget: 1000,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.title).toEqual('Test Project');
          projectId = res.body.id;
        });
    });

    it('should get all projects', () => {
      return request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBeTruthy();
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('should get a project by id', () => {
      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(projectId);
          expect(res.body.title).toEqual('Test Project');
        });
    });
  });
});