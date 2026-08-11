document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. 共通：microCMSデータ取得・描画関数
    // =========================================================
    const fetchAndRender = ({ containerSelector, endpoint, limit, fields, renderHtml }) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const FLASK_PROXY_BASE_URL = 'https://microcms-proxy-281456272382.asia-northeast1.run.app/api/v1';
        const url = `${FLASK_PROXY_BASE_URL}/${endpoint}?${new URLSearchParams({ limit, fields })}`;

        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then(res => {
                if (!res.contents || res.contents.length === 0) {
                    container.innerHTML = "<p>現在、お知らせはありません。</p>";
                    return;
                }
                container.innerHTML = res.contents.map(renderHtml).join('');
            })
            .catch(err => {
                console.error("データ取得エラー:", err);
                container.innerHTML = "<p>データの取得に失敗しました。</p>";
            });
    };

    // ニュース取得の実行例（状況に合わせて適宜呼び出す）
    fetchAndRender({
        containerSelector: '#news-list',
        endpoint: 'news',
        limit: 10,
        fields: 'id,class,title,publishedAt,link,anker,content',
        renderHtml: (item) => `
            <div class="news-list" style="border-bottom: 1.5px solid #006a00ff; padding: 1px 0;">
                <p style="font-size: small; color: gray;" id="${item.anker}">更新日: ${new Date(item.publishedAt).toLocaleDateString('ja-JP')}</p>
                <h2>${item.class}${item.title}</h2>
                <p>${item.content}</p>
            </div><br>`
    });

    // =========================================================
    // 2. ページトップボタン
    // =========================================================
    const pageTopBtn = document.getElementById('page-top');
    if (pageTopBtn) {
        window.addEventListener('scroll', () => {
            pageTopBtn.style.display = (window.pageYOffset > 200) ? 'block' : 'none';
        });
        pageTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================================
    // 3. お問い合わせフォームバリデーション
    // =========================================================
    const form = document.getElementById('contactForm');
    if (form) {
        const emailInput = document.getElementById('email');
        const emailConfirm = document.getElementById('emailConfirm');
        const inquiry = document.getElementById('inquiry');
        const charCount = document.getElementById('charCount');

        const validate = () => {
            const isMatch = emailInput.value === emailConfirm.value;
            emailConfirm.setCustomValidity(isMatch ? '' : 'メールアドレスが一致しません');
            document.getElementById('emailMismatch').style.display = isMatch ? 'none' : 'block';
            
            const len = inquiry.value.length;
            charCount.textContent = `${len} / 500 文字`;
            charCount.style.color = (len > 500) ? '#E74C3C' : '#666';
            inquiry.setCustomValidity(len > 500 ? '500文字を超えています' : '');
        };

        [emailInput, emailConfirm, inquiry].forEach(el => el.addEventListener('input', validate));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) return alert('入力内容を確認してください。');
            
            const status = document.getElementById('formStatus');
            status.style.display = 'block';
            status.textContent = '送信中...';
            setTimeout(() => {
                status.textContent = 'お問い合わせを受け付けました。';
                form.reset();
                validate();
            }, 3000);
        });
    }
});