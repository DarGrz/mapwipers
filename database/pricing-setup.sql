-- Utworzenie tabeli pricing w Supabase
CREATE TABLE IF NOT EXISTS pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('service', 'addon')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Dodanie indeksów dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_pricing_type ON pricing(type);
CREATE INDEX IF NOT EXISTS idx_pricing_code ON pricing(code);
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing(is_active);

-- Włączenie RLS (Row Level Security)
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- Dodanie polityki RLS - odczyt dla wszystkich
CREATE POLICY "Allow read access for all users" ON pricing
  FOR SELECT USING (true);

-- Dodanie polityki RLS - zapis tylko dla authenticated users (opcjonalne)
CREATE POLICY "Allow insert for authenticated users" ON pricing
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON pricing
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Wstawianie domyślnych cen
INSERT INTO pricing (name, code, price, type, description) VALUES 
  ('Remove Profile', 'remove', 499.00, 'service', 'Complete removal of Google Business Profile'),
  ('Reset Profile', 'reset', 299.00, 'service', 'Reset Google Business Profile to clean state'),
  ('1-Year Protection', 'yearProtection', 199.00, 'addon', 'Prevents reappearance for 12 months'),
  ('Express Service', 'expressService', 99.00, 'addon', 'Priority processing within 24-48 hours')
ON CONFLICT (code) DO NOTHING;

-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger do automatycznego aktualizowania updated_at
CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
