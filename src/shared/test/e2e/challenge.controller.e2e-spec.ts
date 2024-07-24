import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ChallengeModule } from '../../../apps/challenge/src/challenge.module';
import { challengeMock } from '../../../shared/test/mocks/challenge-mock';
import { AllExceptionsFilter } from '../../../shared/filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChallengeModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });

  it('/ (POST) - should return an object with uid on successful POST request', async () => {
    const requestBody = challengeMock();
    const response = await request(app.getHttpServer())
      .post('/')
      .send(requestBody)
      .expect(201);
    expect(response.body).toHaveProperty('uid');
  });

  it('/ (POST) - should return 400 on invalid POST request', async () => {
    const requestBody = challengeMock();
    requestBody.name = '';
    const response = await request(app.getHttpServer())
      .post('/')
      .send(requestBody)
      .expect(400);
    expect(response.body.message).toEqual(
      'Field name must contain at least 1 character.',
    );
  });

  it('/ (POST) - should handle heavy load without crashing', async () => {
    const requests = Array.from({ length: 100 }, () => {
      return request(app.getHttpServer()).post('/').send(challengeMock());
    });

    await Promise.all(requests.map((req) => req.expect(201)));
  });
});
