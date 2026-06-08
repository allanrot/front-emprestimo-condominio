import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('condo-share-token');

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      }
    } catch (error) {
      console.error('Token inválido ou corrompido', error);
    }
  }

  localStorage.removeItem('condo-share-token');
  router.navigate(['/login']);
  return false;
};
