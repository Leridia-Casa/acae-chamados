-- 1. Remover as restrições antigas (não se preocupe se falhar caso não existam)
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_area_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_area_check;

-- 2. Atualizar registros existentes de "Manutenção" para "Manutenção Predial"
UPDATE public.tickets SET area = 'Manutenção Predial' WHERE area = 'Manutenção';
UPDATE public.profiles SET area = 'Manutenção Predial' WHERE area = 'Manutenção';

-- 3. Adicionar coluna image_url se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tickets' AND column_name = 'image_url') THEN
        ALTER TABLE public.tickets ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 4. Adicionar as novas restrições com as 5 áreas
ALTER TABLE public.tickets ADD CONSTRAINT tickets_area_check CHECK (area IN ('TI', 'Manutenção Predial', 'Limpeza', 'Coordenação', 'Administrativo'));
ALTER TABLE public.profiles ADD CONSTRAINT profiles_area_check CHECK (area IN ('TI', 'Manutenção Predial', 'Limpeza', 'Coordenação', 'Administrativo'));
