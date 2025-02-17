import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServiceFinalService } from '../services/login/service-final.service';

export const guardFinalGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRole = localStorage.getItem('userRole');

  if (!userRole || (userRole !== 'admin' && userRole !== 'student')) {
    router.navigate(['/login']);
    return false;
  }

  if (route.data && route.data['roles']) {
    const hasPermission = route.data['roles'].includes(userRole);

    if (!hasPermission) {
      router.navigate(['/game']);
      return false;
    }
  }
  return true;
};