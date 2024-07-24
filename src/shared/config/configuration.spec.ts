import configuration from './configuration';

const mockEnv = (env) => {
  process.env = { ...env };
};

describe('configuration', () => {
  test('returns an object', () => {
    mockEnv({});
    const config = configuration();
    expect(typeof config).toBe('object');
  });

  test('returns environment correctly', () => {
    mockEnv({ ENVIRONMENT: 'test' });
    const config = configuration();
    expect(config.environment).toBe('test');
  });

  test('returns port correctly', () => {
    mockEnv({ PORT: '5000' });
    const config = configuration();
    expect(config.port).toBe(5000);

    mockEnv({});
    const defaultConfig = configuration();
    expect(defaultConfig.port).toBe(3000);
  });

  test('returns database host and port correctly', () => {
    mockEnv({ DATABASE_HOST: 'localhost', DATABASE_PORT: '5433' });
    const config = configuration();
    expect(config.database.host).toBe('localhost');
    expect(config.database.port).toBe(5433);
  });
});
