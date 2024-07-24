# Usar a imagem do Node.js 20
FROM node:20

# Setar o diretório de trabalho
WORKDIR /app


# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código para o contêiner
COPY . .

COPY .env .env


# Gerar o Prisma Client
RUN npx prisma generate

# Construir a aplicação
RUN npm run build

# Expor a porta que o app vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
