# Morse Trainer

Ứng dụng web luyện nghe mã Morse hằng ngày, thiết kế cho người mới bắt đầu.

## Tính năng

- 13 cấp độ mở dần toàn bộ bảng chữ cái.
- Sau mỗi hai level có một thử thách tổng hợp bắt buộc; phải đạt 80% mới được học tiếp.
- Thử thách có 3 tim, sai một câu mất một tim và hết tim sẽ thất bại.
- Chuỗi 15 câu đúng liên tiếp giúp vượt qua thử thách sớm.
- Chế độ Luyện phát Morse dùng một phím điện báo tròn để nhập chấm/gạch bằng chuột, cảm ứng hoặc phím Space.
- App phát tone 650 Hz và đánh giá chuỗi ký hiệu, độ dài âm cùng khoảng nghỉ.
- Màn hình chính gọn với `Play · Level hiện tại` và `Levels`.
- Điều chỉnh tốc độ từ 8 đến 24 WPM.
- Mỗi lượt đặt mục tiêu ngẫu nhiên từ 20 đến 30 câu đúng.
- Trả lời sai phải nghe và làm lại chính câu đó; tiến độ không tăng.
- Cần độ chính xác ít nhất 80% để mở cấp độ tiếp theo.
- Điều khiển bằng chuột hoặc bàn phím; nhấn `Space` để nghe lại.
- Lưu XP, chuỗi ngày học, cấp độ đã mở và kỷ lục trên trình duyệt.

## Chạy trên máy

```bash
python3 -m http.server 8000
```

Mở `http://localhost:8000` trong trình duyệt. App không cần cài thư viện.

## Cấu trúc

Toàn bộ giao diện, kiểu dáng và logic nằm trong `index.html`, phù hợp để học cách HTML, CSS và JavaScript hoạt động cùng nhau.
