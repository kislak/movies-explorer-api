# movies-explorer-api


https://api.kino.nomoredomains.rocks/


# dev evn
```
npm run dev
open localhost:3000

npm run lint-fix 
```


# deploy
https://console.cloud.yandex.ru/folders/b1g330f1n062j0n0h95h/compute?section=instances

# dns
https://domain.nomoreparties.site/

62.84.114.60

api.kino.nomoredomains.rocks


#setup node:
```
# в этой команде замените 14 на ту мажорную
# версию Node, которая стоит у вас локально
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

# установите Node.js
sudo apt install -y nodejs 
```


#setup mongo
```bash
# 1.
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# 2.
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# 3.
sudo apt update

# 4.
sudo apt install -y mongodb-org 


sudo service mongod start 
sudo systemctl enable mongod.service 
mongo
```

#setup git
```bash
sudo apt install -y git 

#git clone xxx

npm install 
npm start 
```

#setup app

```bash
sudo npm install pm2 -g
pm2 start app.js
pm2 startup
pm2 save 
sudo reboot

```

#setup nginx
```bash
sudo apt update # обновляем список пакетов (программ), доступных для установки
sudo apt install -y nginx # устанавливаем nginx

sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH 
sudo ufw enable 
 
sudo systemctl enable --now nginx  

sudo vim /etc/nginx/sites-available/default

server {
      listen 80;

      server_name api.kino.nomoredomains.rocks www.api.kino.nomoredomains.rocks;

      location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
      }
} 


sudo nginx -t 
sudo systemctl reload nginx
```

# update app
```
git pull origin main
pm2 restart app 
```

# ssl
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx 

sudo systemctl reload nginx 


# to update cert
sudo certbot renew --pre-hook "service nginx stop" --post-hook "service nginx start" 
```

