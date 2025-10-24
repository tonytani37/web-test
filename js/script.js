    // Flaskサーバーのアドレス（例: 開発環境のローカルホスト）
    // 本番環境では、Cloud Runなどにデプロイされた公開URLに置き換えます。
    const FLASK_PROXY_BASE_URL = 'https://cms-api-281456272382.us-east1.run.app/api/v1';

    // MicroCMSのコンテンツエンドポイント（例: blogs）とクエリパラメータ
    const endpoint = 'news';
    const queryParams = new URLSearchParams({
        limit: 3,
        fields: 'id,title,publishedAt,link' // 取得フィールドを制限
    });

    const url = `${FLASK_PROXY_BASE_URL}/${endpoint}?${queryParams.toString()}`;

    fetch(url)
        .then(response => {
            // HTTPステータスコードをチェック
            if (!response.ok) {
                // Flaskサーバーからのエラーレスポンス（4xx, 5xx）を処理
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(res => {
            // 取得したデータ（MicroCMSのコンテンツ）を処理
            // console.log("MicroCMSから取得したデータ:", data);
            // 例: 記事一覧をDOMに表示する処理など
            if (!res.contents || res.contents.length === 0) {
                newsListContainer.innerHTML = "<p>現在、お知らせはありません。</p>";
                return;
            }
            // const limit = 3; // 表示したい記事の最大件数
            // const limitedContents = res.contents.slice(0, limit); // 先頭から3件を切り出す
            // console.log(limitedContents)
            // 記事の配列をループ処理
            res.contents.forEach(item => {
            // limitedContents.forEach(item => {
                // 日付を整形
                const formattedDate = new Date(item.publishedAt).toLocaleDateString('ja-JP');
                const linkWithAnchor = `${item.link}#${item.id}`;
                const articleHtml = `
                    <div class="news-list" style="border-bottom: 0.5px solid #ccc; padding: 1px 0;">
                        <p style="font-size: small; color: gray;" >更新日: ${formattedDate}</p>
                        <a href="${linkWithAnchor}">
                            ${item.title}
                        </a>
                    </div>
                `;
                // <div class="news-content">${item.content}</div>
                // 記事コンテナに追加
                newsListContainer.innerHTML += articleHtml;
            });
            })
        .catch(error => {
            // ネットワークエラーや上記のエラースローをキャッチ
            console.error("データの取得中にエラーが発生しました:", error);
        });

    const newsListContainer = document.querySelector('#news-list');

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