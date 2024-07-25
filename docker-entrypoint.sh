#!/bin/sh

# Executa as migrações do Prisma
npx prisma migrate deploy

# Executa o script de seed
npm run seed:run

# Inicia a aplicação NestJS
npm run start:prod
