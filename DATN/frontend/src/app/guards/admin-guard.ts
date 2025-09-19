// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.getUser()) {
      this.router.navigate(['/dang-nhap']);
      return false;
    }
    if (this.auth.isAdmin()) return true;

    this.router.navigate(['/']);
    return false;
  }
}
