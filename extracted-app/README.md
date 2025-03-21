# XAHOD HQ - Extracted Application Code

This directory contains the extracted business logic, data models, and services from the XAHOD HQ application, separated from the UI framework (Vue/Vuestic) to make it portable to other UI frameworks.

## Directory Structure

- `/types`: Data models and TypeScript interfaces
- `/services`: Framework-agnostic services for API communication, error handling, etc.
- `/utils`: Utility functions and helpers
- `/composables`: Business logic previously in Vue composables, refactored to be framework-agnostic
- `/data`: Data access and transformation logic
- `/stores`: State management logic extracted from Pinia stores
- `/config.ts`: Application configuration

## Migration Guide

This extraction preserves the business logic, data models, and service layer of the application while removing UI framework-specific code. Follow these steps to migrate to a new UI framework:

### 1. State Management

The extracted code includes a framework-agnostic state management system in the `/stores` directory. You have two options:

1. **Use the provided state management**: The extracted stores implement a simple pub/sub pattern with actions, mutations, and getters, similar to Vuex/Pinia.

2. **Adapt to your framework's state management**: Map the store definitions to your framework's state management solution (Redux, MobX, Zustand, etc.).

Example of using the extracted state management:

```typescript
import { marketStore } from './extracted-app/stores'

// Access state
console.log(marketStore.$state.assets)

// Use getters
console.log(marketStore.allAssets)

// Dispatch actions
marketStore.$dispatch('load')

// Subscribe to changes
const unsubscribe = marketStore.$subscribe((mutation, state) => {
  console.log(`Mutation: ${mutation}`, state)
})
```

### 2. API Services

The `/services` directory contains framework-agnostic services for API communication, error handling, and logging:

```typescript
import { apiService } from './extracted-app/services'

// Configure API service
apiService.setAuthToken('your-auth-token')

// Make API requests
const data = await apiService.get('/api/market')
```

### 3. Data Access

The `/data` directory contains functions for fetching and manipulating data:

```typescript
import { fetchTransactions, getTransactions } from './extracted-app/data'

// Fetch all transactions
const transactions = await fetchTransactions()

// Get filtered and paginated transactions
const { data, pagination } = await getTransactions({
  isActive: true,
  page: 1,
  perPage: 10,
  sortBy: 'creation_time',
  sortingOrder: 'desc',
})
```

### 4. Composables

The `/composables` directory contains business logic extracted from Vue composables:

```typescript
import { createTransactionsState, fetchTransactions } from './extracted-app/composables'

// Create state
const state = createTransactionsState()

// Fetch data
await fetchTransactions(state)

// Access state
console.log(state.transactions)
```

### 5. Utilities

The `/utils` directory contains utility functions:

```typescript
import { formatDate, cropString } from './extracted-app/utils'

// Format a date
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD')

// Crop a string
const croppedString = cropString('0x1234567890abcdef', 4, 4) // "0x12...cdef"
```

### 6. Configuration

The `/config.ts` file contains application configuration:

```typescript
import { createConfig } from './extracted-app/config'

// Create configuration with environment-specific values
const config = createConfig({
  API_URL: 'https://api.example.com',
  ENVIRONMENT: 'production',
})
```

## UI Component Migration

When implementing UI components in your new framework, you'll need to:

1. Create components that correspond to the original Vue components
2. Connect them to the extracted state management, services, and utilities
3. Implement the UI-specific logic (rendering, event handling, etc.)

### Example: Transactions Page

Original Vue component structure:
- `TransactionsPage.vue` (main page)
  - `TransactionsTable.vue` (table component)
  - `EditTransactionForm.vue` (edit form)
  - `ViewTransactionForm.vue` (view details)

New framework implementation:
1. Create corresponding components in your framework
2. Use the extracted `useTransactions` composable for data fetching and manipulation
3. Connect to the `transactionsStore` for state management

## Routing Structure

The application has the following main routes that should be implemented in your new framework:

- `/dashboard`: System overview and metrics
- `/transactions`: Transaction management
- `/trading`: Trading operations and history
- `/transfer`: Asset transfer management
- `/control-panel`: System control and configuration
- `/settings`: Application settings
- `/tech/events`: Trade events history
- `/tech/accounts`: Account management

## Uncertainties and TODOs

- **Authentication**: The authentication mechanism is tightly coupled to Azure AD and would need to be reimplemented based on your authentication requirements.
- **Real-time Updates**: The original application uses polling for updates. Consider implementing WebSockets or Server-Sent Events for real-time data.
- **Error Handling**: The error handling is basic and should be enhanced based on your framework's capabilities.
- **Form Validation**: Form validation logic is minimal in the extracted code and would need to be implemented using your framework's form validation capabilities.
- **Offline Support**: The application has basic offline support that could be enhanced with a proper service worker implementation.