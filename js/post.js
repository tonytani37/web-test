document.addEventListener('DOMContentLoaded', function() {
    const pageTopBtn = document.getElementById('page-top');

    // スクロールイベントを監視
    window.addEventListener('scroll', function() {
        // 現在のスクロール位置が一定量を超えたらボタンを表示
        if (window.pageYOffset > 200) { // 200pxスクロールしたら表示
            pageTopBtn.style.display = 'block';
        } else {
            pageTopBtn.style.display = 'none';
        }
    });

    // ボタンクリックイベント
    pageTopBtn.addEventListener('click', function(e) {
        e.preventDefault(); // デフォルトのアンカーリンク動作を無効にする（ページが瞬間的にトップに戻るのを防ぐ）

        // スムーズスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // スムーズスクロールを有効にする
        });
    });
});
// script_list.js に追記

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailConfirmInput = document.getElementById('emailConfirm');
    const emailMismatch = document.getElementById('emailMismatch');
    const inquiryTextarea = document.getElementById('inquiry');
    const charCount = document.getElementById('charCount');
    const maxChars = 500;

    // --- 1. メールアドレスの一致確認 ---
    const checkEmailMatch = () => {
        if (emailInput.value !== emailConfirmInput.value) {
            emailMismatch.style.display = 'block';
            emailConfirmInput.setCustomValidity('メールアドレスが一致しません');
            return false;
        } else {
            emailMismatch.style.display = 'none';
            emailConfirmInput.setCustomValidity('');
            return true;
        }
    };

    emailInput.addEventListener('input', checkEmailMatch);
    emailConfirmInput.addEventListener('input', checkEmailMatch);

    // --- 2. 問い合わせ内容の文字数カウント ---
    const updateCharCount = () => {
        const currentLength = inquiryTextarea.value.length;
        charCount.textContent = `${currentLength} / ${maxChars} 文字`;

        if (currentLength > maxChars) {
            charCount.style.color = '#E74C3C'; // 赤色
            inquiryTextarea.setCustomValidity(`500文字を超えています。現在 ${currentLength} 文字です。`);
        } else {
            charCount.style.color = '#666'; // 標準色
            inquiryTextarea.setCustomValidity('');
        }
    };

    inquiryTextarea.addEventListener('input', updateCharCount);
    // ページロード時にも初期値を表示
    updateCharCount();

    // --- 3. フォーム送信処理 (デモ) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 最終チェック
        if (!checkEmailMatch() || inquiryTextarea.checkValidity() === false) {
            alert('入力内容を確認してください。');
            return;
        }

        const formStatus = document.getElementById('formStatus');
        formStatus.style.display = 'block';
        formStatus.textContent = '送信処理を実行中...';
        formStatus.style.backgroundColor = '#f0e68c'; // 黄色

        // **ここにサーバーレスAPI (Cloud Run) を呼び出す処理を記述します。**
        
        // デモ用: 3秒後に成功メッセージを表示
        setTimeout(() => {
            formStatus.textContent = 'お問い合わせを受け付けました。ありがとうございます。';
            formStatus.style.backgroundColor = '#2ecc71'; // 緑色
            formStatus.style.color = 'white';
            form.reset(); // フォームをリセット
            updateCharCount(); // カウントをリセット
        }, 3000);
    });
});