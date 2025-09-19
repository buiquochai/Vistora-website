import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './oder.component.html',
  styleUrls: ['./oder.component.css']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = 'Tất cả';
  isAdmin: boolean = false;
  token: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Lấy thông tin user từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User info from localStorage:', userInfo);

    this.isAdmin = userInfo.isAdmin || false;
    this.token = userInfo.token || '';

    if (!this.token) {
      console.warn('Token không tồn tại, chuyển về trang login');
      this.router.navigate(['/login']);
      return;
    }

    this.fetchOrders();
  }

  private getAuthHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }

  fetchOrders() {
    const url = this.isAdmin
      ? 'http://localhost:5000/api/orders'
      : 'http://localhost:5000/api/orders/my-orders';

    this.http.get<any[]>(url, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data) => {
          console.log('Orders fetched:', data);
          this.orders = data.map(order => ({
            _id: order._id.$oid ? order._id.$oid : order._id,
            date: order.createdAt,
            status: order.status,
            items: order.products.map((p: any) => ({
              productId: p.productId?._id ? p.productId._id : p.productId,
              name: p.productId?.name || 'Sản phẩm',
              quantity: p.quantity,
              price: p.price,
              image: p.image || ''
            })),
            totalAmount: order.totalAmount
          }));
          this.filteredOrders = [...this.orders];
        },
        error: (err) => {
          console.error('Fetch orders error:', err);
          if (err.status === 401) {
            Swal.fire('Thông báo', 'Bạn cần đăng nhập để xem đơn hàng.', 'warning');
            this.router.navigate(['/login']);
          } else {
            Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng.', 'error');
          }
        }
      });
  }

  filterOrders() {
    this.filteredOrders =
      this.selectedStatus === 'Tất cả'
        ? [...this.orders]
        : this.orders.filter(o => o.status === this.selectedStatus);
  }

  getTotalAmount(order: any) {
    return order.totalAmount;
  }

  cancelOrder(order: any) {
    if (order.status !== 'Chờ xác nhận') {
      Swal.fire('Không thể hủy', 'Chỉ có thể hủy đơn hàng đang ở trạng thái "Chờ xác nhận".', 'warning');
      return;
    }
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Đơn hàng sẽ được hủy!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, hủy ngay!',
      cancelButtonText: 'Không'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.put(`http://localhost:5000/api/orders/${order._id}/cancel`, {}, { headers: this.getAuthHeaders() })
          .subscribe({
            next: () => {
              order.status = 'Đã hủy';
              Swal.fire('Đã hủy!', 'Đơn hàng đã được hủy.', 'success');
            },
            error: (err) => {
              Swal.fire('Lỗi', 'Không thể hủy đơn hàng.', 'error');
              console.error(err);
            }
          });
      }
    });
  }

  reorder(order: any) {
    if (!order.items || order.items.length === 0) return;
    const item = order.items[0];
    this.router.navigate(['/checkout'], { queryParams: { productId: item.productId, quantity: item.quantity } });
  }

  viewOrderDetail(order: any) {
    if (!order || !order._id) return;
    this.router.navigate(['/order-detail', order._id]);
  }
}
