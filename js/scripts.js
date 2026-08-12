// js/script.js
// トップページ（お知らせ要約）とお知らせ一覧ページ（お知らせ全文）で共通利用するスクリプト
// container(#news-list)の data-mode 属性で表示モードを切り替える
//   data-mode 無し / "summary" -> トップページ用（3件・タイトルのみ）
//   data-mode="full"          -> お知らせ一覧ページ用（10件・本文まで表示）

document.addEventListener('DOMContentLoaded', () => {
    initNewsList();
    initPageTopButton();
    initContactForm();
});

// ------------------------------
// お知らせ一覧
// ------------------------------
function initNewsList() {
    const container = document.querySelector('#news-list');
    if (!container) return; // このページにお知らせ欄が無ければ何もしない

    const FLASK_PROXY_BASE_URL = 'https://microcms-proxy-281456272382.asia-northeast1.run.app/api/v1';
    // const FLASK_PROXY_BASE_URL = 'http://localhost:8080/api/v1';
    const endpoint = 'news';

    const mode = container.dataset.mode || 'summary';
    const limit = container.dataset.limit || (mode === 'full' ? 10 : 3);
    const fields = container.dataset.fields ||
        (mode === 'full'
            ? 'id,class,title,publishedAt,link,anker,content'
            : 'id,class,title,publishedAt,link');

    const queryParams = new URLSearchParams({ limit, fields });
    const url = `${FLASK_PROXY_BASE_URL}/${endpoint}?${queryParams.toString()}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(res => {
            if (!res.contents || res.contents.length === 0) {
                container.innerHTML = "<p>現在、お知らせはありません。</p>";
                return;
            }
            res.contents.forEach(item => {
                const formattedDate = new Date(item.publishedAt).toLocaleDateString('ja-JP');
                container.innerHTML += (mode === 'full')
                    ? renderFullArticle(item, formattedDate)
                    : renderSummaryArticle(item, formattedDate);
            });
        })
        .catch(error => {
            console.error("データの取得中にエラーが発生しました:", error);
        });
}

function renderSummaryArticle(item, formattedDate) {
    const linkWithAnchor = `${item.link}#${item.id}`;
    return `
        <div class="news-list" style="border-bottom: 0.5px solid #ccc; padding: 1px 0;">
            <p style="font-size: small; color: gray;">更新日: ${formattedDate}</p>
            <a href="${linkWithAnchor}">
                ${item.class}${item.title}
            </a>
        </div>
    `;
}

function renderFullArticle(item, formattedDate) {
    return `
        <div class="news-list" style="border-bottom: 1.5px solid #006a00ff; padding: 1px 0;">
            <p style="font-size: small; color: gray;" id="${item.anker}">更新日: ${formattedDate}</p>
            <h2>${item.class}${item.title}</h2>
            <p>${item.content}</p>
        </div><br>
    `;
}

// ------------------------------
// ページトップボタン
// ------------------------------
function initPageTopButton() {
    const pageTopBtn = document.getElementById('page-top');
    if (!pageTopBtn) return;

    window.addEventListener('scroll', () => {
        pageTopBtn.style.display = window.pageYOffset > 200 ? 'block' : 'none';
    });

    pageTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ------------------------------
// お問い合わせフォーム（フォームが存在するページのみ動作。無ければ何もしない）
// ------------------------------
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const emailConfirmInput = document.getElementById('emailConfirm');
    const emailMismatch = document.getElementById('emailMismatch');
    const inquiryTextarea = document.getElementById('inquiry');
    const charCount = document.getElementById('charCount');
    const maxChars = 500;

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

    const updateCharCount = () => {
        const currentLength = inquiryTextarea.value.length;
        charCount.textContent = `${currentLength} / ${maxChars} 文字`;
        if (currentLength > maxChars) {
            charCount.style.color = '#E74C3C';
            inquiryTextarea.setCustomValidity(`500文字を超えています。現在 ${currentLength} 文字です。`);
        } else {
            charCount.style.color = '#666';
            inquiryTextarea.setCustomValidity('');
        }
    };

    inquiryTextarea.addEventListener('input', updateCharCount);
    updateCharCount();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkEmailMatch() || inquiryTextarea.checkValidity() === false) {
            alert('入力内容を確認してください。');
            return;
        }

        const formStatus = document.getElementById('formStatus');
        formStatus.style.display = 'block';
        formStatus.textContent = '送信処理を実行中...';
        formStatus.style.backgroundColor = '#f0e68c';

        setTimeout(() => {
            formStatus.textContent = 'お問い合わせを受け付けました。ありがとうございます。';
            formStatus.style.backgroundColor = '#2ecc71';
            formStatus.style.color = 'white';
            form.reset();
            updateCharCount();
        }, 3000);
    });
}