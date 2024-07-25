export default () => {
  return {
    environment: process.env.ENVIRONMENT,
    port: parseInt(process.env.PORT, 10) || 3333,
    database: {
      url: process.env.DATABASE_URL,
    },
  };
};
