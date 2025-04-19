# Guia de Implantação do Site Organizador de Agenda TDAH

Este documento fornece instruções detalhadas para implantar o site do Organizador de Agenda TDAH na Vercel.

## Pré-requisitos

- Conta no GitHub
- Conta na Vercel
- Projeto Google Cloud com API Calendar habilitada

## Passo 1: Preparar o Repositório

1. Crie um novo repositório no GitHub
2. Faça upload dos arquivos do projeto para o repositório
3. Certifique-se de que a estrutura do projeto está correta:
   - `/src`: Código-fonte da aplicação
   - `/migrations`: Arquivos SQL para o banco de dados
   - `package.json`: Dependências do projeto
   - `vercel.json`: Configuração da Vercel
   - `.env.example`: Exemplo de variáveis de ambiente

## Passo 2: Configurar o Projeto Google Cloud

1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/)
2. Crie um novo projeto (ou use um existente)
3. Habilite a API do Google Calendar:
   - No menu lateral, vá para "APIs e Serviços" > "Biblioteca"
   - Pesquise por "Google Calendar API" e habilite

4. Configure a tela de consentimento OAuth:
   - No menu lateral, vá para "APIs e Serviços" > "Tela de consentimento OAuth"
   - Selecione "Externo" e clique em "Criar"
   - Preencha as informações necessárias (nome do aplicativo, e-mail de contato)
   - Adicione o escopo "https://www.googleapis.com/auth/calendar"
   - Conclua a configuração

5. Crie credenciais OAuth 2.0:
   - No menu lateral, vá para "APIs e Serviços" > "Credenciais"
   - Clique em "Criar Credenciais" > "ID do cliente OAuth"
   - Selecione "Aplicativo da Web"
   - Adicione "https://tdah-agenda.vercel.app/api/auth/callback/google" como URI de redirecionamento autorizado
     (Substitua "tdah-agenda" pelo nome real do seu projeto na Vercel)
   - Clique em "Criar"
   - Anote o ID do cliente e o segredo do cliente para uso posterior

## Passo 3: Implantar na Vercel

1. Acesse [Vercel](https://vercel.com/) e faça login
2. Clique em "Add New..." > "Project"
3. Importe o repositório GitHub que contém o projeto
4. Configure as variáveis de ambiente:
   - `NEXTAUTH_URL`: URL do seu site (ex: https://tdah-agenda.vercel.app)
   - `NEXTAUTH_SECRET`: Uma string aleatória e segura (pode gerar em [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32))
   - `GOOGLE_CLIENT_ID`: ID do cliente OAuth do Google (do passo 2)
   - `GOOGLE_CLIENT_SECRET`: Segredo do cliente OAuth do Google (do passo 2)
   - `OPENWEATHER_API_KEY`: (opcional) Chave da API OpenWeatherMap
   - `GOOGLE_MAPS_API_KEY`: (opcional) Chave da API Google Maps

5. Clique em "Deploy"
6. Aguarde a conclusão da implantação

## Passo 4: Configurar o Banco de Dados

1. Na interface da Vercel, vá para a aba "Storage"
2. Clique em "Connect Database" e selecione "Cloudflare D1"
3. Siga as instruções para conectar o banco de dados
4. Execute o arquivo de migração SQL (`migrations/0001_initial.sql`) para criar as tabelas necessárias

## Passo 5: Testar a Aplicação

1. Acesse a URL fornecida pela Vercel (ex: https://tdah-agenda.vercel.app)
2. Siga o guia de testes (`test-guide.md`) para verificar todas as funcionalidades
3. Documente quaisquer problemas encontrados

## Passo 6: Manutenção e Atualizações

Para atualizar o site após a implantação inicial:

1. Faça as alterações necessárias no código
2. Envie as alterações para o repositório GitHub
3. A Vercel detectará automaticamente as alterações e implantará a nova versão

## Solução de Problemas

### Erro de Autenticação

Se encontrar erros de autenticação:
1. Verifique se as variáveis de ambiente `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretas
2. Confirme se a URI de redirecionamento está configurada corretamente no console do Google Cloud
3. Verifique se a API do Google Calendar está habilitada

### Erro de Banco de Dados

Se encontrar erros relacionados ao banco de dados:
1. Verifique se o banco de dados D1 está configurado corretamente
2. Confirme se as migrações SQL foram executadas com sucesso
3. Verifique os logs da Vercel para mais detalhes sobre o erro

### Outros Erros

Para outros erros:
1. Verifique os logs da Vercel para identificar o problema
2. Consulte a documentação da Vercel e do Next.js
3. Procure por soluções em fóruns como Stack Overflow ou GitHub Issues

## Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Documentação da API do Google Calendar](https://developers.google.com/calendar/api/guides/overview)
