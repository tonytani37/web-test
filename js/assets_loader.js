// 1. GCSのベースURLを変数として定義
const GCS_BASE_URL = 'https://storage.googleapis.com/react-images-tonytani37/mori-no-sato/statics/img/';

// 2. ページロード完了後に画像パスを動的に設定する関数
document.addEventListener('DOMContentLoaded', () => {
    // <img> タグの更新
    document.querySelectorAll('img[data-gcs-path]').forEach(img => {
        const path = img.getAttribute('data-gcs-path');
        if (path) {
            img.src = GCS_BASE_URL + path;
        }
    });

    // <video> の poster 属性の更新
    document.querySelectorAll('video[data-gcs-poster]').forEach(video => {
        const path = video.getAttribute('data-gcs-poster');
        if (path) {
            video.poster = GCS_BASE_URL + path;
        }
    });

    // <source> タグの更新 (動画ファイル)
    document.querySelectorAll('source[data-gcs-src]').forEach(source => {
        const path = source.getAttribute('data-gcs-src');
        if (path) {
            source.src = GCS_BASE_URL + path;
        }
    });
});