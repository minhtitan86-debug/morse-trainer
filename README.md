# Morse Trainer

Ứng dụng web luyện nghe mã Morse hằng ngày, thiết kế cho người mới bắt đầu.

## Tính năng

- 13 cấp độ mở dần toàn bộ bảng chữ cái.
- Điều chỉnh tốc độ từ 8 đến 24 WPM.
- Bài luyện nhanh 10 câu hoặc thử thách 20 câu.
- Điều khiển bằng chuột hoặc bàn phím; nhấn `Space` để nghe lại.
- Lưu XP, chuỗi ngày học, cấp độ đã mở và kỷ lục trên trình duyệt.

## Chạy trên máy

```bash
python3 -m http.server 8000
```

Mở `http://localhost:8000` trong trình duyệt. App không cần cài thư viện.

## Cấu trúc

Toàn bộ giao diện, kiểu dáng và logic nằm trong `index.html`, phù hợp để học cách HTML, CSS và JavaScript hoạt động cùng nhau.
