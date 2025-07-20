# JobHunter 🎯

Một nền tảng tìm việc làm hiện đại được xây dựng với Next.js, giúp kết nối ứng viên và nhà tuyển dụng một cách hiệu quả.


## 🚀 Tính năng chính

### Dành cho Ứng viên
- **Tìm kiếm công việc**: Tìm kiếm việc làm theo vị trí, công ty, mức lương
- **Lọc thông minh**: Bộ lọc theo ngành nghề, kinh nghiệm, loại hình làm việc
- **Ứng tuyển trực tuyến**: Nộp hồ sơ và theo dõi trạng thái ứng tuyển
- **Quản lý hồ sơ**: Tạo và cập nhật CV, thông tin cá nhân
- **Lưu công việc**: Bookmark các vị trí quan tâm

### Dành cho Nhà tuyển dụng
- **Đăng tin tuyển dụng**: Tạo và quản lý các tin tuyển dụng
- **Quản lý ứng viên**: Xem và đánh giá hồ sơ ứng viên
- **Dashboard quản lý**: Thống kê và báo cáo tuyển dụng
- **Tìm kiếm ứng viên**: Chủ động tìm kiếm nhân tài phù hợp

### Tính năng chung
- **Giao diện responsive**: Tối ưu cho mọi thiết bị
- **Xác thực bảo mật**: Đăng nhập/đăng ký an toàn
- **Thông báo real-time**: Cập nhật trạng thái ứng tuyển tức thời

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **State Management**: Context API
- **UI Components**: Flowbite React
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form
- **Styling**: Tailwind CSS + CSS Modules
- **Icons**: Lucide React/React Icons

## 📦 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js 18.0.0 trở lên
- npm/yarn/pnpm
- Git

### Bước 1: Clone repository
```bash
git clone https://github.com/Lochoang21/JobHunter.git
cd JobHunter
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Bước 3: Cấu hình environment
```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong file `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database (nếu có)
DATABASE_URL=your-database-url

# External Services
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Bước 4: Chạy dự án development
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc thư mục

```
├── components/        # Các component React tái sử dụng
├── pages/            # Các trang của ứng dụng (Next.js routing)
├── public/           # Tài nguyên tĩnh (hình ảnh, favicon, v.v.)
├── styles/           # File CSS (nếu không dùng Tailwind CSS hoàn toàn)
├── utils/            # Các hàm tiện ích
├── .env.local        # File cấu hình biến môi trường
├── next.config.js    # Cấu hình Next.js
├── package.json      # Quản lý dependencies
└── README.md         # Tài liệu dự án
```

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

### Quy trình đóng góp:
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👥 Team

- **Lộc Hoàng** - [@Lochoang21](https://github.com/Lochoang21) - Lead Developer


## 🙏 Acknowledgments

- Cảm ơn tất cả contributors đã đóng góp cho dự án
- Sử dụng icons từ [Lucide React](https://lucide.dev)
- Inspiration từ các nền tảng tuyển dụng hàng đầu

---

⭐ Nếu bạn thấy dự án hữu ích, hãy give star để support chúng tôi!
