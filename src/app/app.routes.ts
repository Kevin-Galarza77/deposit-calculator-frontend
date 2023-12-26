import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'login', title: 'Login', loadComponent: () => import('./auth/login/login.component') },
    {
        path: 'home', loadComponent: () => import('./pages/home/home/home.component'), children: [
            { path: 'products', title: 'Productos', loadComponent: () => import('./pages/home/products/list/list.component') },
            { path: 'weeks', title: 'Semanas', loadComponent: () => import('./pages/home/weeks/list-weeks/list-weeks.component') },
            { path: 'weeks/:id', title: 'Detalles de semana', loadComponent: () => import('./pages/home/weeks/details-week/details-week.component') },
        ]
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
