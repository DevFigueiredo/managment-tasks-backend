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


# Gerar o Prisma Client
RUN npx prisma generate

# Construir a aplicação
RUN npm run build

# Copia o script de inicialização
COPY docker-entrypoint.sh .

# Define permissões de execução para o script de inicialização
RUN chmod +x docker-entrypoint.sh

# Expõe a porta em que a aplicação vai rodar
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["./docker-entrypoint.sh"]