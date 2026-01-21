# 🚀 Jak Przetestować Teraz

## Krok 1: Otwórz Przeglądarkę

Wejdź na: **http://localhost:3001**

(Uwaga: Port 3001, ponieważ 3000 był zajęty)

## Krok 2: Znajdź Przełącznik Języka

W prawym górnym rogu nawigacji zobaczysz dwa przyciski:

```
[EN] [PL]
```

## Krok 3: Kliknij "PL"

Po kliknięciu przycisku PL:
- ✅ Nawigacja zmieni się na polski
- ✅ Ceny zmienią się z $ na zł
- ✅ Wszystkie teksty będą po polsku

## Krok 4: Sprawdź Informator (prawy dolny róg)

Zobaczysz czarny box z informacjami:

```
Locale: PL          ← Język
Currency: PLN       ← Waluta
Path: /             ← Aktualna ścieżka
```

## Krok 5: Przełącz z powrotem na EN

Kliknij przycisk "EN" aby wrócić do angielskiej wersji.

---

## ✅ Co Powinno Działać

### Nawigacja (Header)
- EN: "How it Works", "Pricing", "FAQ", "Contact"
- PL: "Jak to działa", "Cennik", "FAQ", "Kontakt"

### Footer
- EN: "All rights reserved", "Privacy Policy", "Terms of Service"
- PL: "Wszelkie prawa zastrzeżone", "Polityka Prywatności", "Regulamin"

### Przyciski
- Aktywny język: biały tekst na niebieskim tle
- Nieaktywny język: niebieski tekst, szare tło przy hover

---

## 🔍 Testowanie Zaawansowane

### Test 1: Sprawdź konsolę przeglądarki

1. Otwórz DevTools (F12)
2. Przejdź do zakładki Console
3. Kliknij przełącznik PL/EN
4. Sprawdź czy nie ma błędów

### Test 2: Sprawdź Network

1. Otwórz DevTools → Network
2. Odśwież stronę
3. Kliknij przełącznik PL
4. Zobacz jakie requesty się wykonują

### Test 3: Sprawdź React DevTools (jeśli masz)

1. Znajdź komponent `LocaleProvider`
2. Zobacz wartość `locale` w state
3. Przełącz język i zobacz jak się zmienia

---

## 📸 Przykładowe Zmiany

### Strona Główna (jeśli są tłumaczenia)
- Hero Title EN: "Remove Unwanted Google Maps Profiles"
- Hero Title PL: "Usuń Niechciane Profile z Google Maps"

### Ceny (przykład)
- EN: Starting at **$299**
- PL: Od **1196 zł**

---

## ❓ Częste Problemy

### Przełącznik nie pojawia się?
- Sprawdź czy komponent Header jest zaimportowany w layout
- Odśwież stronę (Ctrl+Shift+R)

### Tłumaczenia się nie zmieniają?
- Sprawdź konsolę czy są błędy
- Upewnij się że komponenty używają `useLocaleContext()`

### Informator się nie pokazuje?
- To normalne - pokazuje się tylko w development mode
- Nie pojawi się po `npm run build && npm start`

---

## 🎯 Następne Kroki

Kiedy wszystko działa lokalnie:

1. ✅ Zweryfikuj że przełącznik PL/EN działa
2. ✅ Sprawdź kilka stron (jeśli masz więcej)
3. ✅ Przetestuj formularze z różnymi językami
4. 🚀 Deploy na Vercel
5. 🌍 Dodaj domenę pl.mapwipers.com w DNS
6. 🧪 Przetestuj z VPN z Polski

---

## 💡 Podpowiedzi

- Możesz zostawić serwer włączony w tle
- Zmiany w kodzie będą automatycznie odświeżane (hot reload)
- Jeśli coś nie działa, restartuj serwer (Ctrl+C i `npm run dev`)

**Gotowe! Możesz teraz testować wielojęzyczność strony** 🎉
