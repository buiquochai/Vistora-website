import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  quantity: number = 1;
  stockError: string = '';
  rating = 0;
  starsArray = [1, 2, 3, 4, 5];
  suggestedProducts: any[] = [];

  comments = [
    { name: 'Nam', content: 'Áo đẹp, chất vải mịn!', avatar: 'https://i.pravatar.cc/50?img=1' },
    { name: 'Linh', content: 'Mua rồi, mặc lên sang lắm!', avatar: 'https://i.pravatar.cc/50?img=2' }
  ];

  newComment = { name: '', content: '', avatar: 'https://i.pravatar.cc/50' };



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Lấy sản phẩm hiện tại
    this.http.get(`http://localhost:5000/api/products/${id}`).subscribe(data => {
      this.product = data;
      // Nếu stock có sẵn, giới hạn quantity
      if (this.product.stock && this.quantity > this.product.stock) {
        this.quantity = this.product.stock;
      }
    });

    // Lấy danh sách sản phẩm và chọn 4 sản phẩm ngẫu nhiên
    this.http.get<any[]>(`http://localhost:5000/api/products`).subscribe(products => {
      const filtered = products.filter(p => p._id !== id);
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      this.suggestedProducts = shuffled.slice(0, 4).map(p => ({
        ...p,
        image: p.image || 'assets/no-image.png'
      }));
    });
  }

  // Kiểm tra số lượng nhập
  onQuantityChange(): void {
    if (!this.product) return;

    if (this.quantity < 1) {
      this.quantity = 1;
      this.stockError = '';
    } else if (this.product.stock && this.quantity > this.product.stock) {
      this.quantity = this.product.stock;
      this.stockError = `Số lượng hiện không đủ. Tối đa: ${this.product.stock}`;
    } else {
      this.stockError = '';
    }
  }

  setRating(value: number): void {
    this.rating = value;
  }

  submitComment(): void {
    if (!this.newComment.name || !this.newComment.content) return;
    const randomAvatar = `https://i.pravatar.cc/50?u=${Date.now()}`;
    this.comments.push({ ...this.newComment, avatar: randomAvatar });
    this.newComment = { name: '', content: '', avatar: 'https://i.pravatar.cc/50' };
  }

  scrollToGuide(event: Event): void {
    event.preventDefault();
    document.getElementById('size-guide')?.scrollIntoView({ behavior: 'smooth' });
  }


  // trong constructor thêm Router
  constructor(
  private route: ActivatedRoute,
  private http: HttpClient,
  private router: Router  // ✅ Thêm Router
) {}

// Thêm phương thức buyNow
buyNow(): void {
  if (!this.product) return;

  this.router.navigate(['/checkout'], {
    queryParams: {
      productId: this.product._id,
      quantity: this.quantity
    }
  });
}

addToCart(): void {
  if (!this.product) return;

  // Lấy cart từ localStorage, nếu chưa có thì tạo mảng rỗng
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existingIndex = cart.findIndex((item: any) => item.productId === this.product._id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += this.quantity;
  } else {
    cart.push({
      productId: this.product._id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      image: this.product.image
    });
  }

  // Lưu lại vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Thông báo
  alert('Sản phẩm đã được thêm vào giỏ hàng!');
}

}

