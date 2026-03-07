/**
 * Central Routes Registry
 * 
 * This file aggregates routes from all feature modules.
 * To add a new feature:
 * 1. Import its routes array.
 * 2. Spread it into the 'allRoutes' array.
 * 
 * This pattern minimizes merge conflicts.
 */

// Example Import (Uncomment when you have feature routes)
// import { useCaseRoutes } from '../pages/UseCase/useCaseRoutes';

export const allRoutes = [
    // ...useCaseRoutes,

    // placeholder home route
    {
        path: '/',
        element: <div>Welcome to Cafe OS - Modular Routing is active!</div>
    }
];
