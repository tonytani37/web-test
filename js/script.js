    const { createClient } = microcms;

    const client = createClient({
      serviceDomain: 'info-oshirase', // service-domain は https://XXXX.microcms.io の XXXX 部分
      apiKey: 'uvmCNlFCsI2uzLJ4QwKvp8Rf0Nldi2CfTnej',
    })
    const newsListContainer = document.querySelector('#news-list');
    // エンドポイント名のみを指定し、全記事（または複数記事）を取得
    client.get({ endpoint: 'news'}) // ★ ID（gppino0sel）を削除してエンドポイント名のみにする
    .then((res) => {
    // console.log("API応答データ全体:", res);
        // 記事の配列 (res.contents) が存在するか確認
        if (!res.contents || res.contents.length === 0) {
            newsListContainer.innerHTML = "<p>現在、お知らせはありません。</p>";
            return;
        }
        const limit = 3; // 表示したい記事の最大件数
        const limitedContents = res.contents.slice(0, limit); // 先頭から3件を切り出す
        // console.log(limitedContents)
        // 記事の配列をループ処理
        // res.contents.forEach(item => {
        limitedContents.forEach(item => {
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
        .catch((err) => {
        console.error("コンテンツの取得に失敗しました:", err);
        document.body.innerHTML = "<h1>お知らせの取得中にエラーが発生しました。</h1>";
    });