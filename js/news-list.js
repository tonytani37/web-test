document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 共通：microCMSデータ取得・描画関数
    // =========================================================
    const fetchAndRenderNews = ({ containerSelector, limit, fields, renderHtml }) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        // 初期メッセージをクリア
        container.innerHTML = '';

        const FLASK_PROXY_BASE_URL = 'https://microcms-proxy-281456272382.asia-northeast1.run.app/api/v1';
        const endpoint = 'company';
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
                    container.innerHTML = "<p style=\"text-align: center; color: #888; padding: 10px;\">現在、お知らせはありません。</p>";
                    return;
                }

                res.contents.forEach(item => {
                    container.innerHTML += renderHtml(item);
                });
            })
            .catch(err => {
                console.error("コンテンツの取得に失敗しました:", err);
                container.innerHTML = `
                    <li style="text-align: center; color: red; padding: 10px;">
                        データ取得に失敗しました。時間をおいて再度お試しください。
                    </li>
                `;
            });
    };

    // =========================================================
    // 1-1. 詳細表示用（#js-news）の呼び出し
    // =========================================================
    fetchAndRenderNews({
        containerSelector: '#js-news',
        limit: 100,
        fields: 'info,title,comment,img,publishedAt',
        renderHtml: (item) => {
            const formattedDate = new Date(item.publishedAt).toLocaleDateString('ja-JP', { 
                year: 'numeric', month: '2-digit', day: '2-digit' 
            });
            
            // 前のコードの書き方を生かす場合
            const imgValue = item.img ?? { url: "statics/img/imfomation.webp" };

            return `
                <div>
                    <br>
                    <p>${formattedDate}</p>
                    <p class="news-title">${item.info} ${item.title}</p>
                    <br>
                    <p>${item.comment}</p>
                    <br>
                    <!-- 前と同じように ?W=300 をつける -->
                    <img src="${imgValue.url}?W=300">
                </div>
                <br>
                <hr>
            `;
        }
    });

    // =========================================================
    // 1-2. リスト表示用（#js-news-list）の呼び出し
    // =========================================================
    fetchAndRenderNews({
        containerSelector: '#js-news-list',
        limit: 3,
        fields: 'info,title,publishedAt',
        renderHtml: (item) => {
            const formattedDate = new Date(item.publishedAt).toLocaleDateString('ja-JP', { 
                year: 'numeric', month: '2-digit', day: '2-digit' 
            });

            return `
                <li>
                    <time>${formattedDate}</time>
                    <span>${item.info}</span>
                    <p>${item.title}</p>
                </li>
            `;
        }
    });

    // =========================================================
    // 2. 事業概要カード (business-summary) スクロール出現アニメーション
    // =========================================================
    const cards = document.querySelectorAll('.business-summary .card');

    if (cards.length > 0) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                    observer.unobserve(entry.target); 
                }
            });
        }, options);

        cards.forEach(card => {
            observer.observe(card);
        });
    }

});