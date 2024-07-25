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
    expect(defaultConfig.port).toBe(3333);
  });

  test('returns database host and port correctly', () => {
    mockEnv({ DATABASE_URL: 'localhost' });
    const config = configuration();
    expect(config.database.url).toBe('localhost');
  });
});
