import React from 'react';
import { Navigate } from 'react-router-dom';
import { ownerRoutes } from './ownerRoutes';

export const allRoutes = [
    ...ownerRoutes,
    { path: '/', element: <Navigate to="/login" replace /> }
];
