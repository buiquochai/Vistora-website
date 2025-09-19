import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // ✅ thêm dòng này

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ thêm RouterModule vào imports
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  selectedType: string = 'all';
  selectedSort: string = 'all';

  pageSize: number = 12;
  currentPage: number = 1;
  totalPages: number = 0;

  Products: any[] = [];        // Dữ liệu từ backend
  filteredProducts: any[] = [];
  pagedProducts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Gọi API lấy dữ liệu
  loadProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.Products = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Lỗi khi load sản phẩm:', err);
      }
    });
  }

  // Lọc & sắp xếp
  applyFilters() {
    let filtered = [...this.Products];

    // Lọc theo loại
    if (this.selectedType && this.selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === this.selectedType);
    }

    // Sắp xếp
    switch (this.selectedSort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.currentPage = 1;
    this.setPagedProducts();
  }

  // Phân trang
  setPagedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.filteredProducts.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedProducts();
  }
}
