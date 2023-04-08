# FlixtorMovieWeb
#nodejs_express

cấu trúc thư mục src:
1. config: chứa các tệp cấu hình (configuration files) cho ứng dụng. 
    lưu ý khai báo các biến môi trường (tương tự env.example).
2. controllers: chứa các tệp điều khiển (controllers) được sử dụng để thực thi logic xử lý các yêu cầu. cú pháp đặt tên: xxx.controller.js - xxx là hành động.
3. middlewares: chứa các tệp middleware được sử dụng để xử lý các yêu cầu trước khi chúng được xử lý bởi tuyến đường (route) tương ứng. cú pháp đặt tên: xxx.middleware.js
4. models: chứa các tệp mô hình đối tượng (models) được sử dụng để tương tác với cơ sở dữ liệu. cú pháp đặt tên: xxx.model.js
5. public
    5.1. images
    5.2. styles
        5.2.1. css
        5.2.2. js
6. routes: chứa các tệp định nghĩa tuyến đường (routes) được sử dụng để xử lý yêu cầu từ phía người dùng. cú pháp đặt tên: xxx.route.js
7. views
    7.1. partials: chứa các tệp định nghĩa các thành phần dùng chung: header, footer, table, list,...
    7.2. pages: