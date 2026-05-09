# 🍇 Acai — Sistema de Chamados

Sistema de abertura e acompanhamento de chamados para as equipes de **TI** e **Manutenção**, construído com Next.js 14 + Supabase.

---

## 🚀 Setup Rápido

### 1. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute o conteúdo de [`supabase-schema.sql`](./supabase-schema.sql)
3. Copie suas chaves em **Project Settings → API**

### 2. Configurar as variáveis de ambiente

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> ⚠️ A `SERVICE_ROLE_KEY` fica em **Project Settings → API → service_role**. **Nunca exponha ela no frontend.**

### 3. Criar o usuário Admin inicial

No Supabase Dashboard:
1. Vá em **Authentication → Users → Add user**
2. Preencha e-mail + senha
3. Depois no **SQL Editor**, execute:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'seu-admin@email.com';
```

### 4. Rodar o projeto

```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📱 Páginas do Sistema

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Landing page |
| `/login` | Público | Tela de login |
| `/dashboard` | Logado | Dashboard com chamados recentes |
| `/chamados/novo` | Logado | Abrir novo chamado |
| `/chamados` | Logado | Meus chamados |
| `/chamados/[id]` | Logado | Detalhe do chamado |
| `/admin` | Admin | Painel administrativo |
| `/admin/chamados` | Admin/Técnico | Todos os chamados |
| `/admin/usuarios` | Admin | Gerenciar usuários |

---

## 👥 Perfis de Usuário

| Role | Permissões |
|------|------------|
| `admin` | Acesso total — cria usuários, vê todos os chamados |
| `tecnico` | Vê e atualiza chamados da sua área |
| `usuario` | Abre e acompanha os próprios chamados |

---

## 🗄️ Banco de Dados

Tabelas principais:
- `profiles` — usuários (extende `auth.users`)
- `tickets` — chamados
- `ticket_comments` — comentários/respostas

---

## 🎨 Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth + PostgreSQL + RLS)
- **Tailwind CSS** (design customizado)
- **Lucide React** (ícones)
