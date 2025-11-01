    // Flaskサーバーのアドレス（例: 開発環境のローカルホスト）
    // 本番環境では、Cloud Runなどにデプロイされた公開URLに置き換えます。
    const FLASK_PROXY_BASE_URL = 'https://t-cms-api-281456272382.asia-northeast2.run.app/api/v1';
    // const FLASK_PROXY_BASE_URL = 'http://localhost:8080/api/v1';


    // MicroCMSのコンテンツエンドポイント（例: blogs）とクエリパラメータ
    const endpoint = 'news';
    const queryParams = new URLSearchParams({
        limit: 10,
        fields: 'id,class,title,publishedAt,link,anker,content' // 取得フィールドを制限
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
            // 記事の配列をループ処理
            res.contents.forEach(item => {
            // limitedContents.forEach(item => {
                // 日付を整形
                const formattedDate = new Date(item.publishedAt).toLocaleDateString('ja-JP');
                const linkWithAnchor = `${item.link}#${item.id}`;
                const articleHtml = `
                <div class="news-list" style="border-bottom: 1.5px solid #006a00ff; padding: 1px 0;">
                    <p style="font-size: small; color: gray;" id="${item.anker}">更新日: ${formattedDate}</p>
                    <h2> ${item.class}${item.title} </h2>
                    <p> ${item.content}</p>
                </div><br>
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