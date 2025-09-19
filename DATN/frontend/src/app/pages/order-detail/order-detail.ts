import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy token từ localStorage
    this.token = localStorage.getItem('token') || '';

    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) return;

    this.fetchOrderDetail(orderId);
  }

  // Tạo headers với token
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  // Lấy chi tiết đơn hàng từ backend
  fetchOrderDetail(orderId: string) {
    this.http.get(`http://localhost:5000/api/orders/${orderId}`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        this.order = res;
        console.log('Order detail fetched:', this.order);
      },
      error: (err: any) => {
        console.error('Fetch order detail error:', err);
        Swal.fire('Lỗi', 'Không thể tải chi tiết đơn hàng', 'error');
      }
    });
  }

  // Tính tổng tiền đơn hàng
  getTotalAmount(): number {
    if (!this.order?.products) return 0;
    return this.order.products.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }

  // Chuyển đến trang sản phẩm
  goToProduct(productId: string) {
    if (!productId) return;
    this.router.navigate(['/product', productId]);
  }
}
