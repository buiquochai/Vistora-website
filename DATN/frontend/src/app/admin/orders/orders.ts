import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

interface Order {
  _id: string;
  name: string;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isAdmin: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.token) {
      alert('Bạn cần đăng nhập');
      return;
    }

    this.isAdmin = user.isAdmin;
    if (!this.isAdmin) {
      alert('Bạn không có quyền truy cập trang này');
      return;
    }

    this.fetchOrders(user.token);
  }

  fetchOrders(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Order[]>('http://localhost:5000/api/orders', { headers }).subscribe({
      next: res => this.orders = res,
      error: err => console.error('Lỗi khi lấy orders:', err)
    });
  }

  confirmOrder(orderId: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<{ message: string, order: Order }>(
      `http://localhost:5000/api/orders/${orderId}/confirm`,
      {},
      { headers }
    ).subscribe({
      next: res => {
        alert(res.message);
        this.fetchOrders(token);
      },
      error: err => alert(err.error.message || 'Xác nhận thất bại')
    });
  }

  cancelOrder(orderId: string) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<{ message: string, order: Order }>(
      `http://localhost:5000/api/orders/${orderId}/cancel`,
      {},
      { headers }
    ).subscribe({
      next: res => {
        alert(res.message);
        this.fetchOrders(token);
      },
      error: err => alert(err.error.message || 'Hủy thất bại')
    });
  }
}
