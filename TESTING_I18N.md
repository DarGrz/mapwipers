# Jak Przetestować System Wielojęzyczny

## Szybki Start - Testowanie Lokalne

### 1. Uruchom serwer

```bash
npm run dev
```

### 2. Otwórz przeglądarkę

Wejdź na: **http://localhost:3000**

### 3. Znajdź przełącznik języka

W prawym górnym rogu nawigacji zobaczysz przyciski **EN** | **PL**

### 4. Kliknij "PL"

Po kliknięciu:
- Strona przełączy się na polski
- Ceny zmienią się z $ na zł (i zostaną przeliczone)
- Wszystkie teksty pokażą się po polsku

### 5. Sprawdź informator debugowania

W prawym dolnym rogu ekranu (tylko w trybie development) zobaczysz czarny box z informacjami:

```
Locale: PL
Currency: PLN
Path: /
```

## Co Sprawdzić

### ✅ Nawigacja
- [ ] Linki w menu są przetłumaczone
- [ ] "How it Works" → "Jak to działa"
- [ ] "Pricing" → "Cennik"
- [ ] "FAQ" → "FAQ"
- [ ] "Contact" → "Kontakt"

### ✅ Ceny
- [ ] Angielska wersja pokazuje $ (dolary)
- [ ] Polska wersja pokazuje zł (złotówki)
- [ ] Ceny są przeliczone (np. $299 → 1196 zł)

### ✅ Footer
- [ ] "All rights reserved" → "Wszelkie prawa zastrzeżone"
- [ ] "Privacy Policy" → "Polityka Prywatności"
- [ ] "Terms of Service" → "Regulamin"

### ✅ Przełącznik języków
- [ ] Kliknięcie EN pokazuje angielską wersję
- [ ] Kliknięcie PL pokazuje polską wersję
- [ ] Aktywny język jest podświetlony na niebiesko

## Testowanie Komponentów

### ServiceCard (jeśli używany)

```tsx
// EN: "Profile Removal" + "$299"
// PL: "Usunięcie Profilu" + "1196 zł"
```

### OrderForm (jeśli używany)

```tsx
// EN: "First Name", "Email Address", "Proceed to Payment"
// PL: "Imię", "Adres Email", "Przejdź do Płatności"
```

## Zaawansowane Testowanie

### Testowanie z Subdomeną (Opcjonalne)

Jeśli chcesz przetestować jak to będzie działać na produkcji z `pl.mapwipers.com`:

1. Edytuj `/etc/hosts`:
```bash
sudo nano /etc/hosts
```

2. Dodaj:
```
127.0.0.1 mapwipers.local
127.0.0.1 pl.mapwipers.local
```

3. Zapisz (Ctrl+O, Enter, Ctrl+X)

4. Odwiedź:
   - `http://mapwipers.local:3000` → EN
   - `http://pl.mapwipers.local:3000` → PL

### Testowanie API Płatności

1. Otwórz konsolę przeglądarki (F12)
2. Przejdź przez proces zamówienia
3. Sprawdź w Network tab request do `/api/create-payment`:

```json
{
  "locale": "pl",
  "currency": "pln",
  "totalPrice": 1196  // Przeliczone z $299
}
```

## Problemy i Rozwiązania

### Problem: Przełącznik języka nie działa

**Rozwiązanie:**
1. Sprawdź czy jest zainstalowany `next/navigation`:
```bash
npm list next
```

2. Wyczyść cache:
```bash
rm -rf .next
npm run dev
```

### Problem: Tłumaczenia się nie zmieniają

**Rozwiązanie:**
1. Sprawdź konsolę przeglądarki - czy są błędy?
2. Upewnij się, że komponent używa `useLocaleContext()`:
```tsx
import { useLocaleContext } from '../context/LocaleContext';

const { t } = useLocaleContext();
```

### Problem: Ceny się nie przeliczają

**Rozwiązanie:**
Sprawdź czy używasz `formatPrice()` lub `convertPrice()`:

```tsx
const { formatPrice } = useLocaleContext();

// Dobrze:
<span>{formatPrice(299)}</span>

// Źle:
<span>${299}</span>
```

### Problem: Informator debugowania nie pokazuje się

To normalne - pojawia się tylko w development mode (`npm run dev`), nie w production.

## Następne Kroki

Po zweryfikowaniu lokalnie:

1. **Deploy na Vercel/hosting**
2. **Dodaj domenę `pl.mapwipers.com` w DNS**
3. **Przetestuj na produkcji z VPN z Polski**
4. **Sprawdź czy przekierowanie działa dla polskich IP**

## Przydatne Komendy

```bash
# Uruchom dev server
npm run dev

# Build do produkcji (testuje czy wszystko się kompiluje)
npm run build

# Uruchom build produkcyjny lokalnie
npm run start

# Sprawdź błędy TypeScript
npx tsc --noEmit
```

## Demo Video (TODO)

Możesz nagrać krótkie wideo pokazujące:
1. Otwarcie localhost:3000
2. Kliknięcie PL
3. Zmianę języka i cen
4. Kliknięcie EN z powrotem
