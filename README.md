# Organizador de Agenda TDAH

Este é um aplicativo web para ajudar pessoas com TDAH a organizar sua agenda diária, com foco em visualização clara do dia seguinte, cálculo de tempos de locomoção, verificação de condições climáticas, sistema de lembretes estratégicos e modo especial para viagens.

## Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento web
- **Tailwind CSS**: Framework CSS para estilização
- **NextAuth.js**: Autenticação com Google
- **Cloudflare D1**: Banco de dados SQL para persistência
- **Vercel**: Plataforma de hospedagem

## Funcionalidades

- Integração com Google Calendar
- Visualização estruturada do dia seguinte (hora a hora)
- Cálculo de tempos de locomoção entre compromissos
- Verificação de condições climáticas que possam afetar a rotina
- Sistema de lembretes estratégicos para evitar esquecimentos
- Modo especial para viagens que reduz ansiedade em locais desconhecidos
- Categorização de atividades (tatuagem, tempo com filho/família/namorada, jogar, treinar)
- Interface minimalista para reduzir distrações

## Configuração para Desenvolvimento

### Pré-requisitos

- Node.js 18 ou superior
- Conta no Google Cloud com API Calendar habilitada
- Conta na Vercel (para implantação)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/tdah-agenda-app.git
cd tdah-agenda-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` e adicione suas credenciais.

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse o aplicativo em `http://localhost:3000`

### Configuração do Banco de Dados

Para configurar o banco de dados D1 do Cloudflare:

1. Descomente as configurações do banco de dados no arquivo `wrangler.toml`
2. Execute o comando para inicializar o banco de dados:
```bash
npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
```

## Implantação na Vercel

1. Crie uma conta na Vercel (se ainda não tiver)
2. Conecte seu repositório GitHub à Vercel
3. Configure as variáveis de ambiente na interface da Vercel:
   - NEXTAUTH_URL: URL do seu site (ex: https://seu-app.vercel.app)
   - NEXTAUTH_SECRET: Uma string aleatória e segura
   - GOOGLE_CLIENT_ID: ID do cliente OAuth do Google
   - GOOGLE_CLIENT_SECRET: Segredo do cliente OAuth do Google

4. Implante o aplicativo:
```bash
npm run build
```

## Estrutura do Projeto

- `/src/app`: Páginas e rotas da aplicação
- `/src/components`: Componentes React reutilizáveis
- `/src/lib`: Utilitários e funções auxiliares
- `/migrations`: Arquivos SQL para configuração do banco de dados
- `/public`: Arquivos estáticos

## Licença

Este projeto é licenciado sob a licença MIT.
