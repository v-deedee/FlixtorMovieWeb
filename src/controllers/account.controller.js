
// xu ly hien trang tao tai khoan
module.exports.register =  (req, res) => {
    res.render('account/register', {title: 'Đăng ký tài khoản'})
}

module.exports.login =  (req, res) => {
    res.render('account/login', {title: 'Đăng Nhập'})
}

module.exports.profile =  (req, res) => {
    res.render('account/profile', {title: 'Thông tin tài khoản'})
}

module.exports.watchList =  (req, res) => {
    res.render('account/watch_list', {title: 'Thông tin tài khoản'})
}