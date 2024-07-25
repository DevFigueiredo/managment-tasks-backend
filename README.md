# Gerenciador de Projetos e Atividades

Bem-vindo ao repositório do projeto **Gerenciador de Projetos e Atividades**. Este projeto é uma aplicação backend desenvolvida em NestJS para gerenciar projetos e atividades, utilizando Prisma para gerenciamento de banco de dados e seguindo boas práticas de desenvolvimento.

## Estrutura de Pastas

Abaixo está a estrutura de pastas do projeto, juntamente com a descrição da finalidade de cada pasta:

```plaintext
.
├── .github
│   └── workflows
│       └── develop.yaml        # Configurações de workflows do GitHub Actions para CI/CD.
├── .vscode
│   └── settings.json           # Configurações do Visual Studio Code para o projeto.
├── coverage                    # Relatórios de cobertura de testes.
├── dist                        # Arquivos compilados da aplicação.
├── node_modules                # Dependências do projeto gerenciadas pelo npm.
├── src
│   ├── modules                 # Módulos da aplicação, divididos por funcionalidades.
│   │   ├── project             # Módulo de gerenciamento de projetos.
│   │   │   ├── infra           # Infraestrutura relacionada ao módulo de projetos.
│   │   │   ├── use-cases       # Casos de uso do módulo de projetos.
│   │   │   │   ├── create-project
│   │   │   │   ├── delete-project
│   │   │   │   ├── get-detail-projects
│   │   │   │   ├── get-projects
│   │   │   │   │   ├── get-projects.use-case.dto.ts
│   │   │   │   │   ├── get-projects.use-case.spec.ts
│   │   │   │   │   ├── get-projects.use-case.ts
│   │   │   │   ├── update-project
│   │   │   └── project.module.ts # Configuração do módulo de projetos.
│   │   ├── status               # Módulo de gerenciamento de status.
│   │   ├── task                 # Módulo de gerenciamento de tarefas.
│   ├── shared                   # Código compartilhado entre os módulos.
│   │   ├── config               # Configurações gerais da aplicação.
│   │   ├── docs                 # Documentação da aplicação.
│   │   ├── domain               # Entidades de domínio.
│   │   ├── filters              # Filtros globais da aplicação.
│   │   ├── infra                # Infraestrutura compartilhada.
│   │   │   └── database
│   │   │       └── prisma       # Configuração e arquivos do Prisma ORM.
│   │   │           ├── migrations
│   │   │           ├── seeds
│   │   │           ├── dev.db
│   │   │           ├── index.ts
│   │   │           └── schema.prisma
│   │   ├── middlewares          # Middlewares globais.
│   │   └── utils                # Funções utilitárias.
│   │       ├── enums            # Definições de enums.
│   │       ├── calculate-percentage.spec.ts
│   │       ├── calculate-percentage.ts
│   │       ├── check-if-delayed.spec.ts
│   │       ├── check-if-delayed.ts
│   │       ├── create-server.ts
│   │       ├── date-now.spec.ts
│   │       ├── date-now.ts
│   │       ├── generate-uuid.spec.ts
│   │       ├── generate-uuid.ts
│   │       └── logger.ts
│   ├── app.module.ts            # Módulo raiz da aplicação.
│   └── main.ts                  # Arquivo de inicialização da aplicação.
├── test                         # Testes automatizados.
├── .env                         # Arquivo de configuração de ambiente.
├── .env.example                 # Exemplo de arquivo de configuração de ambiente.
├── .eslintrc.js                 # Configurações do ESLint.
├── .gitignore                   # Arquivos e pastas ignorados pelo Git.
├── .prettierrc                  # Configurações do Prettier.
├── Dockerfile                   # Dockerfile para criação da imagem Docker.
├── nest-cli.json                # Configurações do Nest CLI.
├── package-lock.json            # Arquivo de lock das dependências npm.
├── package.json                 # Dependências e scripts do projeto.
├── README.md                    # Documentação principal do projeto.
├── tsconfig.build.json          # Configurações de build do TypeScript.
└── tsconfig.json                # Configurações do TypeScript.
```

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd nome-do-repositorio
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:

   - Copie o arquivo `.env.example` e renomeie para `.env`.
   - Edite o arquivo `.env` com as configurações necessárias.

5. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

## Uso

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run start:dev
```

Para compilar a aplicação:

```bash
npm run build
```

Para iniciar a aplicação em modo de produção:

```bash
npm run start:prod
```

## Testes

Para rodar os testes:

```bash
npm run test
```

Para rodar os testes com cobertura:

```bash
npm run test:cov
```

### Com Docker

1. **Crie a Imagem Docker:**

   No diretório raiz do seu projeto, execute o seguinte comando:

   ```bash
   docker-compose build
   ```

2. **Execute o Contêiner:**

   Após a construção da imagem, inicie o contêiner com:

   ```bash
   docker-compose up
   ```

   O Nest.js estará disponível na porta `3333` do seu localhost. Acesse [http://localhost:3333](http://localhost:3333) para ver seu projeto em execução.

## Contribuição

Sinta-se à vontade para contribuir com o projeto. Abra uma issue ou envie um pull request no GitHub.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Nota**: Certifique-se de atualizar os links e comandos conforme necessário para seu projeto específico.
