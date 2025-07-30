# Pricing Management System

Ten system umożliwia zarządzanie cenami usług i dodatków w aplikacji MapWipers przez bazę danych Supabase.

## Konfiguracja

### 1. Baza danych Supabase

Wykonaj skrypt SQL znajdujący się w `database/pricing-setup.sql` w panelu SQL Editor w Supabase:

```sql
-- Znajduje się w database/pricing-setup.sql
-- Skrypt tworzy tabelę pricing i wstawia domyślne ceny
```

### 2. Zmienne środowiskowe

Upewnij się, że masz skonfigurowane zmienne środowiskowe Supabase w pliku `.env.local`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Struktura

### API Endpoints

- `GET /api/pricing` - Pobiera wszystkie aktywne ceny
- `POST /api/pricing` - Tworzy nową pozycję cenową
- `PUT /api/pricing` - Aktualizuje istniejącą pozycję cenową

### Hook usePricing

Hook `usePricing` zapewnia:
- Automatyczne pobieranie cen z bazy danych
- Fallback na domyślne ceny w przypadku błędu
- Funkcje pomocnicze do obliczania sum i pobierania konkretnych cen
- Loading states i error handling

### Komponenty

- `GoogleProfileSearch` - Używa hook usePricing do wyświetlania cen
- `PricingAdmin` - Panel administratora do zarządzania cenami

### Typy usług i dodatków

#### Usługi (services):
- `remove` - Remove Profile
- `reset` - Reset Profile

#### Dodatki (addons):
- `yearProtection` - 1-Year Protection
- `expressService` - Express Service

## Użycie

### W komponencie React

```tsx
import { usePricing } from '../hooks/usePricing';

const MyComponent = () => {
  const { 
    pricing, 
    loading, 
    calculateTotal, 
    getServicePrice 
  } = usePricing();

  const total = calculateTotal('remove', true, false); // service, yearProtection, expressService
  const servicePrice = getServicePrice('remove');
  
  // ...
};
```

### Panel administratora

Dostęp do panelu zarządzania cenami: `/admin/pricing`

Panel umożliwia:
- Przeglądanie wszystkich pozycji cenowych
- Dodawanie nowych pozycji
- Edycję istniejących pozycji
- Zarządzanie statusem aktywności

## Migracja z hardkodowanych cen

System automatycznie używa cen z bazy danych, ale ma fallback na domyślne wartości w przypadku błędu połączenia:

- Remove Profile: $499
- Reset Profile: $299
- 1-Year Protection: $199
- Express Service: $99

## Security

- Tabela ma włączone Row Level Security (RLS)
- Odczyt dozwolony dla wszystkich
- Zapis tylko dla uwierzytelnionych użytkowników
- API endpoints nie wymagają autentyfikacji dla GET
- POST/PUT wymagają dodatkowej walidacji (można dodać auth)

## Rozwój

Aby dodać nowe typy usług lub dodatków:

1. Dodaj nową pozycję w bazie danych przez panel admin lub SQL
2. Zaktualizuj typy TypeScript w `app/types/index.ts`
3. Dodaj odpowiednie funkcje w hook `usePricing` jeśli potrzebne
4. Zaktualizuj komponenty używające pricing

## Testowanie

Przed wdrożeniem na produkcję przetestuj:

1. Połączenie z bazą danych Supabase
2. Pobieranie cen przez API
3. Fallback gdy baza danych jest niedostępna
4. Panel administratora
5. Obliczenia sum w komponencie GoogleProfileSearch
