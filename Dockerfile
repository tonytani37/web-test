FROM nginx:stable-alpine

#カスタムのnginx.confを正しい場所へコピーする ★★★
COPY nginx.conf /etc/nginx/nginx.conf

# HTMLとstaticsをまとめてコピー
COPY index.html information.html /usr/share/nginx/html/
COPY img/ /usr/share/nginx/html/img/
COPY js /usr/share/nginx/html/js/
COPY css /usr/share/nginx/html/css/

# ポート番号はCloud Run標準の8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]