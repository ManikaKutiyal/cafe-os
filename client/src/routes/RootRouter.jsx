import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { allRoutes } from './routes';

/**
 * RootRouter Component
 * Handles all application routes
 */

const RootRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {allRoutes.map((route, index) => {
                    if (route.children) {
                        return (
                            <Route key={index} path={route.path} element={route.element}>
                                {route.children.map((child, childIdx) => (
                                    <Route
                                        key={childIdx}
                                        index={child.index}
                                        path={child.path}
                                        element={child.element}
                                    />
                                ))}
                            </Route>
                        );
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    );
                })}
            </Routes>
        </BrowserRouter>
    );
};

export default RootRouter;