# Wizaro Project Documentation

## Project Overview

Wizaro is a web application for managing Google My Business profiles. The application allows users to:

1. Search for Google My Business (GMB) profiles
2. Select profiles for removal or reset services
3. Track selected profiles in a database
4. Process removal or opinion reset requests

## Core Components & Functionality

### 1. GMB Profile Search & Selection (GoogleRemovalFormStepOne.tsx)

This component provides the interface for searching and selecting Google My Business profiles:

#### Key Features:

- **Dual Mode Operation**: 
  - Profile Removal (removes entire GMB profile)
  - Opinion Reset (removes old profile with all reviews and creates a new one)

- **GMB Profile Search**:
  - Integration with Google Places API via custom API endpoints
  - Debounced search input with 300ms delay
  - Display of search results with business name and address
  - Error handling for empty results or API limitations

- **Profile Selection**:
  - Click-to-select profile mechanism
  - Detailed information display for selected profile
  - Collection of additional profile details via secondary API call
  - Auto-saving selected profile to database

- **Multi-Profile Support**:
  - Adding multiple profiles to a single order
  - Expanding/collapsing profile details
  - Individual profile removal

- **UI/UX Features**:
  - Responsive design for mobile and desktop
  - Loading indicators during search and data fetching
  - Star rating visualization 
  - Animated mode switch between removal and reset services
  - Photo preview for selected businesses

#### State Management:

```typescript
// Key state variables
const [searchQuery, setSearchQuery] = useState<string>("");         // Current search term
const [locations, setLocations] = useState<GmbLocation[]>([]);      // Search results
const [isSearching, setIsSearching] = useState<boolean>(false);     // Loading state for search
const [showResults, setShowResults] = useState<boolean>(false);     // Control search results display
const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error messages
const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<PlaceDetails | null>(null); // Selected profile details
const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false); // Loading state for details
const [isResetMode, setIsResetMode] = useState<boolean>(false);     // Toggle between removal/reset mode
```

#### Data Flow:

1. User enters search query → `handleSearchChange` → debounced call to `searchLocations`
2. `searchLocations` calls `/api/gmb-search` endpoint → displays results
3. User selects a location → `selectLocation` → updates form data and calls `fetchPlaceDetails`
4. `fetchPlaceDetails` calls `/api/places-details` endpoint → saves complete data to database via `/api/searched-gmb`

#### API Integration:

```typescript
// Search for GMB locations
const searchLocations = async (query: string) => {
  // Call to /api/gmb-search with query parameter
  // Processes and displays results
};

// Get detailed place information
const fetchPlaceDetails = async (placeId: string) => {
  // Call to /api/places-details with placeId
  // Save results to database via /api/searched-gmb
};
```

#### Database Integration:

The component saves selected GMB profiles to a database table (searched_gmb) with the following data:

```typescript
// Data structure saved to database
{
  name: data.details.name,                 // Business name
  address: data.details.address,           // Business address
  placeId: data.details.id,                // Google Place ID
  phoneNumber: data.details.phoneNumber,   // Business phone
  website: data.details.website,           // Business website
  googleMapsUrl: data.details.googleMapsUrl, // Google Maps URL
  businessStatus: data.details.businessStatus, // Business status (OPERATIONAL, etc.)
  rating: data.details.rating,             // Business rating (1-5)
  types: data.details.types,               // Business categories
}
```

### 2. API Endpoints

#### GMB Search API (`/api/gmb-search`)

Searches for Google My Business profiles using the Google Places API:

- **Input**: Query string (business name or address)
- **Output**: Array of GMB locations with basic information
- **Rate limiting**: Implements retry-after mechanism for 429 responses

#### Places Details API (`/api/places-details`)

Fetches detailed information about a specific place using Google Places Details API:

- **Input**: Place ID
- **Output**: Comprehensive place details including contact info, photos, ratings
- **Rate limiting**: Implements retry-after mechanism for 429 responses

#### Searched GMB API (`/api/searched-gmb`)

Saves searched and selected GMB profiles to the database:

- **Input**: GMB profile details
- **Output**: Success confirmation or error
- **Features**: Tracks user information (IP, user agent) for analytics

### 3. Database Schema

#### searched_gmb Table

```sql
CREATE TABLE IF NOT EXISTS searched_gmb (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  place_id TEXT,
  phone_number TEXT,
  website TEXT,
  google_maps_url TEXT,
  business_status TEXT,
  rating NUMERIC,
  types TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Component Props & Interfaces

```typescript
// Core interfaces
interface Removal {
  companyName: string;
  nip: string;
  url: string;
}

interface GmbLocation {
  id: string;
  name: string;
  address: string;
  placeId: string;
}

interface PlaceDetails {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  website?: string;
  googleMapsUrl: string;
  photos: string[];
  businessStatus?: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
}

// Component props
interface Props {
  removals: Removal[];               // Array of selected profiles
  expandedIndex: number;             // Currently expanded profile index
  totalPrice: number;                // Total price for selected services
  onChange: (index: number, field: keyof Removal, value: string) => void; // Update removal data
  onAdd: () => void;                 // Add new profile
  onRemove: (index: number) => void; // Remove profile
  onExpand: (index: number) => void; // Expand/collapse profile
  onSubmit: (e: React.FormEvent) => void; // Form submission
}
```

## Integration Points

### Parent Component Integration

The GoogleRemovalFormStepOne component expects the following from its parent:

1. Management of the `removals` array
2. Handling of form submission
3. Price calculation based on selected mode and number of profiles
4. Tracking of expanded/collapsed state

### Data Flow Between Components

1. User selects profiles in GoogleRemovalFormStepOne
2. Selection data is passed to parent component via props callbacks
3. On form submission, data is stored in localStorage for cross-component access:
   ```typescript
   localStorage.setItem("profileOperationMode", isResetMode ? "reset" : "removal");
   localStorage.setItem("serviceDescription", isResetMode 
     ? "Resetowanie opinii na profilu firmy w Mapach Google" 
     : "Usuwanie profilu firmy z Map Google");
   ```

## Key Features Implementation Details

### 1. Debounced Search

```typescript
// Debounced search implementation
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchLocations(searchQuery);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);
```

### 2. Modal Toggle Animation

```typescript
// Animated toggle switch between modes
<div 
  className={`absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-in-out z-0 bg-[#0D2959]
    ${isResetMode ? 'right-1 left-[calc(50%_-_8px)]' : 'left-1 right-[calc(50%_-_8px)]'}
  `}
  style={{
    boxShadow: '0 0 8px rgba(13, 41, 89, 0.4)',
    transform: isResetMode ? 'translateX(4px)' : 'translateX(-4px)',
  }}
>
  {/* Fluid bubble effect */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute rounded-full w-8 h-8 bg-white/30 animate-float" style={{ top: '-10%', left: '10%' }}></div>
      <div className="absolute rounded-full w-6 h-6 bg-white/30 animate-float-delay" style={{ top: '40%', right: '15%' }}></div>
      <div className="absolute rounded-full w-4 h-4 bg-white/30 animate-float-slow" style={{ bottom: '20%', left: '30%' }}></div>
    </div>
  </div>
</div>
```

### 3. Star Rating Visualization

```typescript
// Dynamic star rating display
const renderStarRating = (rating?: number) => {
  if (!rating) return null;
  
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starColor = rating < 4.0 ? "text-red-600" : "text-[#5DA157]";
  
  // Renders SVG stars based on rating value
  // Full, half, and empty stars with appropriate coloring
};
```

### 4. Multiple Profile Management

```typescript
// Handle adding and expanding new profile
<button
  type="button"
  onClick={() => {
    onAdd();
    // Expand newly added profile - pass index that the new profile will have
    onExpand(removals.length);
  }}
  className="w-46 px-2 md:px-4 py-2.5 md:py-2.5 bg-gray-100 hover:bg-gray-200 rounded text-sm md:text-sm"
>
  Dodaj kolejny profil
</button>
```

## Best Practices Used

1. **Single Responsibility Functions**: Each function has a clear, specific purpose
2. **Error Handling**: Comprehensive error handling for API calls and user interactions
3. **Loading States**: Clear loading indicators for all asynchronous operations
4. **Responsive Design**: Mobile and desktop optimized layouts
5. **Database Efficiency**: Avoiding duplicate entries by saving data in a single place
6. **User Feedback**: Notifications for mode changes, loading states, and errors
7. **State Management**: Clean React state management with appropriate state variables
8. **URL Parameter Support**: Reading and using URL parameters for pre-filled data
9. **Form Validation**: Ensuring required data is present before submission
10. **Accessibility**: Semantic HTML with appropriate ARIA attributes and keyboard navigation

## Extension Points

When creating similar projects, consider these potential extension points:

1. **Authentication**: Add user authentication for saved profiles
2. **Analytics**: Track user search patterns and selection behavior
3. **Pagination**: Add pagination for large numbers of search results
4. **Filters**: Add filters for search results by rating, type, etc.
5. **Saved Searches**: Allow users to save searches for future use
6. **Export/Import**: Add functionality to export/import profile selections
7. **History**: Track history of selected profiles
8. **Webhooks**: Implement webhooks for notifying external systems
9. **Batch Processing**: Add batch processing capabilities for multiple selections
10. **Advanced Search**: Implement advanced search with multiple parameters

## Performance Considerations

1. **Debouncing**: Implemented for search to prevent excessive API calls
2. **API Rate Limiting**: Handled with appropriate retry mechanisms
3. **Lazy Loading**: Images and detailed information loaded only when needed
4. **Efficient State Updates**: State updates are batched where possible
5. **Cleanup**: All effects properly clean up resources
6. **Conditional Rendering**: Components render conditionally to reduce DOM operations
7. **Optimized Database Calls**: Single database write for each selected profile

## Troubleshooting Common Issues

1. **Duplicate Database Entries**: Ensure data is saved in only one place (now in fetchPlaceDetails)
2. **API Rate Limiting**: Implement exponential backoff for retry logic
3. **Missing Profile Details**: Check API response formats and error handling
4. **UI Responsiveness**: Ensure loading states are properly managed
5. **Form Validation**: Verify all required fields before submission
