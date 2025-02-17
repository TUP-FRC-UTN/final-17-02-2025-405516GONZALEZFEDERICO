import { Routes } from '@angular/router';
import { guardFinalGuard } from './guard/guard-final.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'game',
    loadComponent: () => import('./components/game/game.component')
      .then(m => m.GameComponent),
    canActivate: [guardFinalGuard],
    data: { roles: ['admin', 'student'] }
  },
  {
    path: 'scores',
    loadComponent: () => import('./components/score/score.component')
      .then(m => m.ScoreComponent),
    canActivate: [guardFinalGuard],
    data: { roles: ['admin', 'student'] }
  }
];
