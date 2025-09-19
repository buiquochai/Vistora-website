import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class CheckoutComponent implements OnInit {
  name = '';
  phone = '';
  address = '';
  quantity = 1;
  product: any = null;
  paymentMethod: string = 'cod';
  agreedToTerms: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['productId'];
      this.quantity = +params['quantity'] || 1;

      if (productId) {
        this.http.get(`http://localhost:5000/api/products/${productId}`, this.getAuthHeaders())
          .subscribe({
            next: (product) => this.product = product,
            error: (err) => {
              console.error('Lỗi tải sản phẩm:', err);
              Swal.fire('Lỗi', 'Không thể tải sản phẩm.', 'error');
            }
          });
      }
    });
  }

  // Lấy header có token để gửi lên backend
  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // token lưu khi login
    if (!token) {
      Swal.fire('Chưa đăng nhập', 'Vui lòng đăng nhập trước khi đặt hàng.', 'warning');
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  get totalAmount(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  submitOrder() {
    if (!this.name || !this.phone || !this.address) {
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin giao hàng.', 'warning');
      return;
    }
    if (!this.agreedToTerms) {
      Swal.fire('Lỗi', 'Vui lòng đồng ý với điều khoản trước khi thanh toán.', 'warning');
      return;
    }
    if (!this.product) {
      Swal.fire('Lỗi', 'Không có sản phẩm để đặt.', 'error');
      return;
    }

    const orderData = {
      name: this.name,
      phone: this.phone,
      address: this.address,
      paymentMethod: this.paymentMethod,
      products: [{
        productId: this.product._id,
        quantity: this.quantity,
        price: this.product.price,
        image: this.product.image
      }],
      totalAmount: this.totalAmount,
      status: 'Chờ xác nhận'
    };

    this.http.post('http://localhost:5000/api/orders', orderData, this.getAuthHeaders())
      .subscribe({
        next: (res: any) => {
          Swal.fire('Thành công', 'Đơn hàng đã được tạo.', 'success');
          this.router.navigate(['/don-hang']);
        },
        error: (err) => {
          console.error('Lỗi tạo đơn hàng:', err);
          Swal.fire('Lỗi', 'Không thể tạo đơn hàng.', 'error');
        }
      });
  }
}
