# SaaS Gerador de Roadmap com IA

Um sistema que utiliza IA para criar roadmaps personalizados, tanto para aprendizado de programação quanto para qualquer área do conhecimento.

## Stack Tecnológica

[![Vite](https://img.shields.io/badge/Vite-optimizations-blue)](https://vitejs.dev) 
[![React](https://img.shields.io/badge/React-frontend-blue)](https://reactjs.org) 
[![TypeScript](https://img.shields.io/badge/TypeScript-language-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-styling-blue)](https://tailwindcss.com) 
[![Supabase](https://img.shields.io/badge/Supabase-database-blue)](https://supabase.io)

## Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes)

## Instruções de Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/saas-gerador-roadmap.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd saas-gerador-roadmap
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Setup do Supabase

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Preencha as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no arquivo `.env`.
3. Execute as migrations SQL no dashboard do Supabase.

## Scripts Disponíveis

- `npm run dev` - Inicia o aplicativo em modo de desenvolvimento.
- `npm run build` - Empacota o aplicativo para produção.
- `npm run preview` - Exibe uma prévia do aplicativo de produção.

## Deploy

Realize o deploy em [Vercel](https://vercel.com) com um clique: [Deploy com Vercel](https://vercel.com/import/nextjs)

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.

---

Gerado pelo AxionOS