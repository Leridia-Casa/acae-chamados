-- 1. Cria o bucket de armazenamento "tickets" (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tickets', 'tickets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilita o RLS na tabela de objetos de storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Cria a política que permite a qualquer usuário autenticado fazer upload
CREATE POLICY "Permitir upload para usuarios autenticados" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'tickets');

-- 4. Cria a política que permite visualização pública das imagens dos chamados
CREATE POLICY "Permitir visualizacao publica das imagens" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'tickets');
