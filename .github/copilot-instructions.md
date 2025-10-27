# SleepSync Project Overview

## Project Architecture

This is a web-based sleep tracking and improvement application built with vanilla JavaScript, HTML, and CSS. Key aspects:

### Core Components

- **Frontend Only**: Pure client-side application with no backend server
- **Data Storage**: Uses browser localStorage for data persistence
- **Authentication**: Client-side auth implementation in `auth.js`
- **Bootstrap 5**: Used for responsive UI components and styling

### Key Files & Directories

```
├── js/
│   ├── auth.js         # Authentication and user management
│   ├── main.js         # Core initialization and shared utilities
│   ├── sleep-test.js   # Sleep assessment questionnaire 
│   ├── sleep-tracker.js # Sleep logging and analytics
│   └── charts.js       # Chart visualization logic
├── css/
│   ├── style.css      # Global styles
│   └── login.css      # Authentication page styles
└── assets/
    └── data/
        └── sleep.tips.json # Sleep improvement recommendations
```

## Development Patterns

### Authentication Flow

- Auth state managed in `auth.js` using localStorage
- Protected routes defined in `auth.js:protectedPages` array
- Auth initialization happens with retry logic on page load:
```javascript
// From auth.js
function initializeAuth() {
    let attempts = 0;
    const maxAttempts = 3;
    
    function tryAuth() {
        attempts++;
        const authResult = checkAuthenticationStatus();
        if (!authResult && attempts < maxAttempts) {
            setTimeout(tryAuth, 200);
        }
    }
}
```

### Data Management

- Sleep tracking data stored in localStorage under user-specific keys
- Chart visualizations use Chart.js library with custom configurations
- Sleep test scoring uses weighted question system (see `sleep-test.js`)

### Event Handling

- Page-specific initialization in respective JS files
- Event listeners set up after DOM content loads
- Tooltips and popovers initialized via Bootstrap

## Common Tasks

### Adding New Sleep Test Questions

Add to `testQuestions` array in `sleep-test.js`:
```javascript
{
    id: [next_id],
    question: "Question text",
    options: [
        { 
            value: "uniqueValue",
            text: "Display Text",
            weight: { category: score }
        }
    ]
}
```

### Modifying Protected Routes

Update `protectedPages` array in `auth.js`:
```javascript
const protectedPages = [
    'dashboard.html',
    'sleep-tracker.html',
    // Add new protected pages here
];
```

## Testing & Debugging

- Use browser dev tools to inspect localStorage for data persistence
- Enable debug logging by setting `localStorage.debug = true`
- Clear user data: `localStorage.removeItem('sleepSync_userData')`
