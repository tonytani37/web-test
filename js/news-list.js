document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 共通：汎用データ取得・描画関数（endpointを追加）
    // =========================================================
    const fetchAndRender = ({ containerSelector, endpoint, limit, fields, renderHtml }) => {
        const container = document.querySelector(containerSelector);
        if (!container) return; // 対象がなければ終了

        container.innerHTML = '';
        const FLASK_PROXY_BASE_URL = 'https://microcms-proxy-281456272382.asia-northeast1.run.app/api/v1';
        const url = `${FLASK_PROXY_BASE_URL}/${endpoint}?${new URLSearchParams({ limit, fields })}`;

        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then(res => {
                if (!res.contents || res.contents.length === 0) {
                    container.innerHTML = "<p>現在、お知らせはありません。</p>";
                    return;
                }
                // 描画
                container.innerHTML = res.contents.map(renderHtml).join('');
            })
            .catch(err => {
                console.error("取得失敗:", err);
                container.innerHTML = "<p style='color:red;'>データ取得に失敗しました。</p>";
            });
    };

    // =========================================================
    // 1. 会社情報 (company) の呼び出し
    // =========================================================
    // 詳細版
    fetchAndRender({
        containerSelector: '#news',
        endpoint: 'company',
        limit: 100,
        fields: 'info,title,comment,img,publishedAt',
        renderHtml: (item) => {
            const date = new Date(item.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const img = item.img ?? { url: "statics/img/imfomation.webp" };
            return `<div><p>${date}</p><p>${item.info} ${item.title}</p><p>${item.comment}</p><img src="${img.url}?W=300"></div><hr>`;
        }
    });

    // =========================================================
    // 2. ニュース (news) の呼び出し（今回追加する分）
    // =========================================================
    
    // 【リスト版】タイトルのみ（以前の news ページ用）
    fetchAndRender({
        containerSelector: '#news-list',
        endpoint: 'news', // ★ ここを 'news' に変更
        limit: 3,
        fields: 'id,class,title,publishedAt,link',
        renderHtml: (item) => {
            const date = new Date(item.publishedAt).toLocaleDateString('ja-JP');
            return `<li><time>${date}</time><a href="${item.link}#${item.id}">${item.class}${item.title}</a></li>`;
        }
    });

    // 【詳細版】全部表示（新しい news ページ用）
    fetchAndRender({
        containerSelector: '#js-news-all',
        endpoint: 'news', // ★ ここを 'news' に変更
        limit: 10,
        fields: 'id,class,title,publishedAt,link,anker,content',
        renderHtml: (item) => `
            <div id="${item.anker}" style="border-bottom: 1.5px solid #006a00ff;">
                <p>更新日: ${new Date(item.publishedAt).toLocaleDateString('ja-JP')}</p>
                <h2>${item.class}${item.title}</h2>
                <p>${item.content}</p>
            </div><br>`
    });

    // ...以下のアニメーション処理などはそのまま...
});