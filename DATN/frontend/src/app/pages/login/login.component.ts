import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      Swal.fire('Lỗi', 'Vui lòng nhập email và mật khẩu', 'warning');
      return;
    }

    this.loading = true;

    this.http.post<any>('http://localhost:5000/api/users/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('Login response:', res);

        if (!res.token || !res.user) {
          Swal.fire('Lỗi', 'Dữ liệu đăng nhập không hợp lệ', 'error');
          this.loading = false;
          return;
        }

        const currentUser = {
          ...res.user,
          token: res.token,
          isAdmin: res.user.role === 'admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        Swal.fire('Thành công', res.message, 'success');

        // Redirect
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        Swal.fire('Lỗi', err.error.message || 'Đăng nhập thất bại', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
