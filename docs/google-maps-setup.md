# Google Maps API Configuration

## Aby Google Maps działała poprawnie, musisz:

1. **Przejdź do Google Cloud Console**: https://console.cloud.google.com/
2. **Włącz Google Maps Embed API**:
   - Przejdź do "APIs & Services" > "Library"
   - Wyszukaj "Maps Embed API"
   - Kliknij na "Maps Embed API" i włącz ją
3. **Sprawdź ograniczenia klucza API**:
   - Przejdź do "APIs & Services" > "Credentials"
   - Kliknij na swój klucz API
   - W sekcji "API restrictions" upewnij się, że "Maps Embed API" jest dozwolone
4. **Dodaj domeny** (opcjonalnie dla bezpieczeństwa):
   - W sekcji "Application restrictions" możesz ograniczyć użycie do określonych domen

## Obecnie używane API:
- **Google Places API**: Do wyszukiwania firm
- **Google Maps Embed API**: Do wyświetlania map
- **Places Details API**: Do pobierania szczegółów firm

## Używany klucz API:
`AIzaSyA8CB4fn8QkWG3UY3S9yX3aFOeDT4PgHJs`

Klucz jest już skonfigurowany w `.env.local`
