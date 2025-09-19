import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';     // <-- Thêm dòng này
import { FormsModule } from '@angular/forms';       // <-- Và dòng này

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchTerm: string = '';
  suggestions: any[] = [];

  selectedType: string = '';
  selectedSort: string = '';

  Products = [
  { id: 1, name: 'Vest Nam Đen Cổ Điển', price: 1200000, type: 'Vest', image: 'assets/sp1.webp' },
  { id: 2, name: 'Vest Xám Lịch Lãm', price: 1400000, type: 'Vest', image: 'assets/sp5.jpg' },
  { id: 3, name: 'Sơ Mi Trắng Dài Tay', price: 350000, type: 'Sơ Mi', image: 'assets/sp6.jpg' },
  { id: 4, name: 'Quần Tây Xám Tôn Dáng', price: 490000, type: 'Quần Âu', image: 'assets/sp7.webp' },
  { id: 5, name: 'Vest Kẻ Caro Trẻ Trung', price: 1550000, type: 'Vest', image: 'assets/sp8.jpg' },
  { id: 6, name: 'Áo Gile Nam Ôm Body', price: 680000, type: 'Gile', image: 'assets/sp9.webp' },
  { id: 7, name: 'Sơ Mi Xanh Pastel', price: 390000, type: 'Sơ Mi', image: 'assets/sp10.webp' },
  { id: 8, name: 'Quần Âu Slimfit Đen', price: 510000, type: 'Quần Âu', image: 'assets/sp11.jpg' },
  { id: 9, name: 'Vest Nam Xanh Cổ Điển', price: 1200000, type: 'Vest', image: 'assets/sp2.jpg' },
  { id: 10, name: 'Vest Xám Lịch Lãm', price: 1400000, type: 'Vest', image:'assets/sp3.jpg' },
  { id: 11, name: 'Vest Kẻ Caro Trẻ Trung', price: 1550000, type: 'Vest', image: '' },
  { id: 12, name: 'Áo Gile Nam Ôm Body', price: 680000, type: 'Gile', image: 'assets/sp9.webp' },
  { id: 13, name: 'Sơ Mi Xanh Pastel', price: 390000, type: 'Sơ Mi', image: '' },
  { id: 15, name: 'Vest Nâu Lịch Thiệp', price: 1300000, type: 'Vest', image: 'assets/sp2.jpg' },
  { id: 16, name: 'Vest Xanh Navy Cao Cấp', price: 1600000, type: 'Vest', image: 'assets/sp4.jpg' },
  { id: 17, name: 'Sơ Mi Hồng Phấn', price: 360000, type: 'Sơ Mi', image: 'assets/sp13.webp' },
  { id: 18, name: 'Sơ Mi Kẻ Sọc Trẻ Trung', price: 370000, type: 'Sơ Mi', image: 'assets/sp12.jpg' },
  { id: 19, name: 'Quần Âu Trắng Sáng', price: 520000, type: 'Quần Âu', image: 'assets/sp14.jpg' },
  { id: 20, name: 'Quần Âu Kẻ Sọc Mảnh', price: 540000, type: 'Quần Âu', image: 'assets/sp15.jpg' },
  { id: 21, name: 'Gile Caro Gọn Gàng', price: 700000, type: 'Gile', image: 'assets/sp16.jpg' },
  { id: 22, name: 'Gile Đen Cổ Điển', price: 680000, type: 'Gile', image: 'assets/sp17.webp' },
  { id: 23, name: 'Vest Ghi Nhẹ Công Sở', price: 1450000, type: 'Vest', image: 'assets/sp18.webp' },
  { id: 24, name: 'Vest Đen Cổ Chữ V', price: 1500000, type: 'Vest', image: 'assets/sp19.jpg' },
  { id: 25, name: 'Sơ Mi Kaki Dày Dặn', price: 400000, type: 'Sơ Mi', image: 'assets/sp10.webp' },
  { id: 26, name: 'Sơ Mi Linen Thoáng Mát', price: 390000, type: 'Sơ Mi', image: 'assets/sp6.jpg' },
  { id: 27, name: 'Quần Âu Form Rộng', price: 530000, type: 'Quần Âu', image: 'assets/sp21.jpg' },
  { id: 28, name: 'Quần Tây Hàn Quốc', price: 550000, type: 'Quần Âu', image: 'assets/sp20.jpg' },
  ];

  onSearchChange() {
    const keyword = this.searchTerm.toLowerCase().trim();
    this.suggestions = keyword
      ? this.Products.filter(p => p.name.toLowerCase().includes(keyword)).slice(0, 5)
      : [];
  }

  selectSuggestion(name: string) {
    this.searchTerm = name;
    this.suggestions = [];
    // Optionally: điều hướng đến trang chi tiết nếu cần
  }
}

