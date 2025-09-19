import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true, // bật standalone mode
  imports: [FormsModule], // <-- bắt buộc để dùng ngModel
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không trùng nhau');
      return;
    }

    const data = { username: this.username, email: this.email, password: this.password };

    this.http.post('http://localhost:5000/api/users/register', data)
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.router.navigate(['/dang-nhap']);
        },
        error: (err) => {
          alert(err.error.message || 'Đăng ký thất bại');
          console.error(err);
        }
      });
  }
}

