// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/dang-nhap']);
  }

  setUser(user: any, token: string) {
    localStorage.setItem('currentUser', JSON.stringify({ ...user, token }));
  }

  getUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}
