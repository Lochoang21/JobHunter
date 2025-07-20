# Sử dụng image Node.js chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Mở cổng ứng dụng Next.js (mặc định 3000)
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "run", "start"]