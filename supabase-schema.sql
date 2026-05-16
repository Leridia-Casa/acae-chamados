-- ============================================================
-- Acaê Chamados — Schema Completo do Supabase
-- Versão: 2.0 | Compatível com a lógica atual do código
--
-- Como usar:
--   1. Acesse o projeto no Supabase → SQL Editor
--   2. Cole todo este conteúdo e clique em "Run"
--   3. O script é idempotente: pode rodar múltiplas vezes sem erros
-- ============================================================


-- ============================================================
-- EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- gen_random_uuid()


-- ============================================================
-- 1. TABELA: profiles
--    Extensão de auth.users — criada automaticamente pelo trigger
--    ao registrar um novo usuário no Supabase Auth.
--
--    Roles:
--      - 'usuario'  → abre chamados, vê os próprios
--      - 'tecnico'  → vê chamados da própria área, muda status
--      - 'admin'    → acesso total, gerencia usuários e chamados
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'usuario'
                          CHECK (role IN ('admin', 'tecnico', 'usuario')),
  area        TEXT        CHECK (area IN ('TI', 'Manutenção')),
  -- 'area' obrigatória apenas para técnicos (validação no app)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.profiles              IS 'Perfis de usuário — espelha auth.users com dados extras da aplicação.';
COMMENT ON COLUMN public.profiles.role         IS 'Papel do usuário: admin | tecnico | usuario';
COMMENT ON COLUMN public.profiles.area         IS 'Área de atuação do técnico: TI | Manutenção (null para admin/usuario)';


-- ============================================================
-- 2. TABELA: tickets
--    Chamados abertos pelos usuários.
--
--    Status (fluxo):
--      Aberto → Em Andamento → Aguardando → Resolvido → Fechado
--
--    Protocolo: gerado no front-end com formato "Acaê-{ano}-{rand5}"
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol     TEXT        NOT NULL UNIQUE,
  title        TEXT        NOT NULL,
  description  TEXT        NOT NULL,
  area         TEXT        NOT NULL CHECK (area IN ('TI', 'Manutenção')),
  priority     TEXT        NOT NULL DEFAULT 'Média'
                           CHECK (priority IN ('Baixa', 'Média', 'Alta', 'Urgente')),
  status       TEXT        NOT NULL DEFAULT 'Aberto'
                           CHECK (status IN ('Aberto', 'Em Andamento', 'Aguardando', 'Resolvido', 'Fechado')),
  location     TEXT,                                -- Ex: "Bloco A, Sala 201"
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ                          -- preenchido ao mudar status para Resolvido
);

COMMENT ON TABLE  public.tickets               IS 'Chamados de suporte abertos pelos usuários.';
COMMENT ON COLUMN public.tickets.protocol      IS 'Protocolo único gerado no front-end: Acaê-{ano}-{rand}';
COMMENT ON COLUMN public.tickets.area          IS 'Equipe destino: TI | Manutenção';
COMMENT ON COLUMN public.tickets.priority      IS 'Prioridade: Baixa | Média | Alta | Urgente';
COMMENT ON COLUMN public.tickets.status        IS 'Status: Aberto | Em Andamento | Aguardando | Resolvido | Fechado';
COMMENT ON COLUMN public.tickets.location      IS 'Localização física do problema (opcional)';
COMMENT ON COLUMN public.tickets.assigned_to   IS 'Técnico responsável pelo chamado (opcional)';
COMMENT ON COLUMN public.tickets.resolved_at   IS 'Data/hora de resolução, preenchida pelo trigger';


-- ============================================================
-- 3. TABELA: ticket_comments
--    Comentários em chamados — públicos ou internos.
--
--    is_internal = TRUE → visível apenas para técnicos e admin
--    is_internal = FALSE → visível para o solicitante também
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id   UUID        NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  is_internal BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- Sem updated_at: comentários não são editáveis pelo design atual
);

COMMENT ON TABLE  public.ticket_comments            IS 'Comentários nos chamados.';
COMMENT ON COLUMN public.ticket_comments.is_internal IS 'TRUE = interno (só técnico/admin vê). FALSE = público (solicitante vê).';


-- ============================================================
-- TRIGGERS: atualiza updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Se o status mudou para 'Resolvido' e resolved_at ainda não foi definido,
  -- registra a data de resolução automaticamente.
  IF TG_TABLE_NAME = 'tickets'
     AND NEW.status = 'Resolvido'
     AND OLD.status <> 'Resolvido'
     AND NEW.resolved_at IS NULL
  THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger em tickets
DROP TRIGGER IF EXISTS tickets_updated_at ON public.tickets;
CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger em profiles
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- TRIGGER: cria perfil automaticamente ao registrar usuário
--          via Supabase Auth (auth.users)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'usuario')
  )
  ON CONFLICT (id) DO NOTHING; -- Evita duplicatas se o trigger rodar mais de uma vez
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Garante que cada usuário só acessa o que lhe é permitido,
-- mesmo que alguém tente manipular a API diretamente.
-- ============================================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- Helper: retorna o role do usuário autenticado (evita subquery repetida)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: retorna a área do técnico autenticado
CREATE OR REPLACE FUNCTION public.current_user_area()
RETURNS TEXT AS $$
  SELECT area FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- -------------------------------------------------------
-- RLS: profiles
-- -------------------------------------------------------

-- Cada usuário vê o próprio perfil
DROP POLICY IF EXISTS "profiles_select_own"   ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admin vê todos os perfis
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.current_user_role() = 'admin');

-- Técnico vê todos os perfis (para exibir "Atribuído a" nos chamados)
DROP POLICY IF EXISTS "profiles_select_tecnico" ON public.profiles;
CREATE POLICY "profiles_select_tecnico" ON public.profiles
  FOR SELECT USING (public.current_user_role() = 'tecnico');

-- Cada usuário pode atualizar o próprio perfil
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin pode atualizar qualquer perfil
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.current_user_role() = 'admin');

-- Admin pode inserir perfis diretamente
DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (public.current_user_role() = 'admin');

-- Service role (usado pela API de criar/remover usuários) tem acesso total
DROP POLICY IF EXISTS "profiles_all_service_role" ON public.profiles;
CREATE POLICY "profiles_all_service_role" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Admin pode deletar perfis (via API com service role)
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;
CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE USING (public.current_user_role() = 'admin');


-- -------------------------------------------------------
-- RLS: tickets
-- -------------------------------------------------------

-- Usuário vê seus próprios chamados
DROP POLICY IF EXISTS "tickets_select_own"       ON public.tickets;
CREATE POLICY "tickets_select_own" ON public.tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Admin vê todos os chamados
DROP POLICY IF EXISTS "tickets_select_admin"     ON public.tickets;
CREATE POLICY "tickets_select_admin" ON public.tickets
  FOR SELECT USING (public.current_user_role() = 'admin');

-- Técnico vê apenas chamados da própria área
--   (se area IS NULL no perfil do técnico, vê todas as áreas)
DROP POLICY IF EXISTS "tickets_select_tecnico"   ON public.tickets;
CREATE POLICY "tickets_select_tecnico" ON public.tickets
  FOR SELECT USING (
    public.current_user_role() = 'tecnico'
    AND (
      public.current_user_area() IS NULL
      OR public.current_user_area() = area
    )
  );

-- Qualquer usuário logado pode abrir chamados (INSERT)
DROP POLICY IF EXISTS "tickets_insert_own"       ON public.tickets;
CREATE POLICY "tickets_insert_own" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Técnico pode atualizar chamados da sua área
DROP POLICY IF EXISTS "tickets_update_tecnico"   ON public.tickets;
CREATE POLICY "tickets_update_tecnico" ON public.tickets
  FOR UPDATE USING (
    public.current_user_role() = 'tecnico'
    AND (
      public.current_user_area() IS NULL
      OR public.current_user_area() = area
    )
  );

-- Admin pode atualizar qualquer chamado
DROP POLICY IF EXISTS "tickets_update_admin"     ON public.tickets;
CREATE POLICY "tickets_update_admin" ON public.tickets
  FOR UPDATE USING (public.current_user_role() = 'admin');

-- Apenas admin pode deletar chamados
DROP POLICY IF EXISTS "tickets_delete_admin"     ON public.tickets;
CREATE POLICY "tickets_delete_admin" ON public.tickets
  FOR DELETE USING (public.current_user_role() = 'admin');


-- -------------------------------------------------------
-- RLS: ticket_comments
-- -------------------------------------------------------

-- Usuário vê comentários PÚBLICOS nos seus próprios chamados
DROP POLICY IF EXISTS "comments_select_public_owner"  ON public.ticket_comments;
CREATE POLICY "comments_select_public_owner" ON public.ticket_comments
  FOR SELECT USING (
    is_internal = FALSE
    AND EXISTS (
      SELECT 1 FROM public.tickets
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Técnico e admin veem TODOS os comentários (inclusive internos)
DROP POLICY IF EXISTS "comments_select_staff"         ON public.ticket_comments;
CREATE POLICY "comments_select_staff" ON public.ticket_comments
  FOR SELECT USING (
    public.current_user_role() IN ('admin', 'tecnico')
  );

-- Usuário pode comentar nos próprios chamados (sempre público)
DROP POLICY IF EXISTS "comments_insert_owner"         ON public.ticket_comments;
CREATE POLICY "comments_insert_owner" ON public.ticket_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND is_internal = FALSE
    AND EXISTS (
      SELECT 1 FROM public.tickets
      WHERE id = ticket_id AND user_id = auth.uid()
    )
  );

-- Técnico pode comentar em chamados da sua área (público ou interno)
DROP POLICY IF EXISTS "comments_insert_tecnico"       ON public.ticket_comments;
CREATE POLICY "comments_insert_tecnico" ON public.ticket_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND public.current_user_role() = 'tecnico'
    AND EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_id
        AND (
          public.current_user_area() IS NULL
          OR public.current_user_area() = t.area
        )
    )
  );

-- Admin pode comentar em qualquer chamado
DROP POLICY IF EXISTS "comments_insert_admin"         ON public.ticket_comments;
CREATE POLICY "comments_insert_admin" ON public.ticket_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND public.current_user_role() = 'admin'
  );


-- ============================================================
-- VIEW: v_tickets_full
--   Facilita as queries do admin e técnico que precisam de dados
--   do solicitante e do responsável junto com o chamado.
--   Usada internamente — o código pode usar SELECT * FROM v_tickets_full
--   em vez de fazer JOIN manual com profiles.
-- ============================================================
CREATE OR REPLACE VIEW public.v_tickets_full AS
SELECT
  t.id,
  t.protocol,
  t.title,
  t.description,
  t.area,
  t.priority,
  t.status,
  t.location,
  t.user_id,
  t.assigned_to,
  t.created_at,
  t.updated_at,
  t.resolved_at,
  -- Dados do solicitante
  u.full_name   AS user_full_name,
  u.email       AS user_email,
  -- Dados do técnico responsável
  a.full_name   AS assigned_full_name,
  a.email       AS assigned_email
FROM public.tickets t
LEFT JOIN public.profiles u ON u.id = t.user_id
LEFT JOIN public.profiles a ON a.id = t.assigned_to;

COMMENT ON VIEW public.v_tickets_full IS 'Chamados com dados do solicitante e do responsável já resolvidos (JOIN automático).';


-- ============================================================
-- ÍNDICES para performance
-- ============================================================

-- Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_user_id    ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status     ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_area       ON public.tickets(area);
CREATE INDEX IF NOT EXISTS idx_tickets_priority   ON public.tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned   ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);

-- Chamados urgentes abertos (query frequente no painel admin)
CREATE INDEX IF NOT EXISTS idx_tickets_urgente_aberto
  ON public.tickets(priority, status)
  WHERE priority = 'Urgente' AND status NOT IN ('Resolvido', 'Fechado');

-- Comentários
CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON public.ticket_comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id   ON public.ticket_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created   ON public.ticket_comments(created_at DESC);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role      ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email     ON public.profiles(email);


-- ============================================================
-- SEED: Dados de exemplo para testar o sistema
--
-- ATENÇÃO: Só execute esta seção se quiser dados de demonstração.
--          Em produção, crie usuários pelo Supabase Dashboard:
--          Authentication → Users → Add user
--          Depois atualize o role:
--          UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@empresa.com';
-- ============================================================

-- Para criar o admin inicial após cadastro manual:
-- UPDATE public.profiles
--   SET role = 'admin'
--   WHERE email = 'seu-admin@email.com';

-- Para promover um usuário existente a técnico de TI:
-- UPDATE public.profiles
--   SET role = 'tecnico', area = 'TI'
--   WHERE email = 'tecnico.ti@empresa.com';

-- Para promover a técnico de Manutenção:
-- UPDATE public.profiles
--   SET role = 'tecnico', area = 'Manutenção'
--   WHERE email = 'tecnico.manut@empresa.com';


-- ============================================================
-- RESUMO DAS TABELAS
-- ============================================================
--
--  public.profiles
--  ├── id (UUID, FK → auth.users)
--  ├── email (TEXT)
--  ├── full_name (TEXT)
--  ├── role (TEXT) → 'admin' | 'tecnico' | 'usuario'
--  ├── area (TEXT) → 'TI' | 'Manutenção' | NULL
--  ├── created_at (TIMESTAMPTZ)
--  └── updated_at (TIMESTAMPTZ)
--
--  public.tickets
--  ├── id (UUID, PK)
--  ├── protocol (TEXT, UNIQUE) → 'Acaê-2026-12345'
--  ├── title (TEXT)
--  ├── description (TEXT)
--  ├── area (TEXT) → 'TI' | 'Manutenção'
--  ├── priority (TEXT) → 'Baixa' | 'Média' | 'Alta' | 'Urgente'
--  ├── status (TEXT) → 'Aberto' | 'Em Andamento' | 'Aguardando' | 'Resolvido' | 'Fechado'
--  ├── location (TEXT, opcional)
--  ├── user_id (UUID, FK → profiles)
--  ├── assigned_to (UUID, FK → profiles, opcional)
--  ├── created_at (TIMESTAMPTZ)
--  ├── updated_at (TIMESTAMPTZ) → atualizado pelo trigger
--  └── resolved_at (TIMESTAMPTZ) → preenchido pelo trigger ao Resolver
--
--  public.ticket_comments
--  ├── id (UUID, PK)
--  ├── ticket_id (UUID, FK → tickets)
--  ├── user_id (UUID, FK → profiles)
--  ├── content (TEXT)
--  ├── is_internal (BOOLEAN) → FALSE = público, TRUE = só técnico/admin
--  └── created_at (TIMESTAMPTZ)
--
--  public.v_tickets_full (VIEW)
--  └── tickets + JOIN profiles (solicitante e responsável)
--
-- ============================================================