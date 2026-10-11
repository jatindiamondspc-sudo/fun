# Deploying HerCall on the Hostinger VPS

HerCall runs next to ShipTrack on the same VPS:

```
Internet → Nginx (80/443) → hercall.example → Next.js on 127.0.0.1:3100 (PM2)
                                                   ↓
                                    Postgres on 127.0.0.1:5432 (database "hercall")
```

Only Nginx faces the internet. The app port (3100) and Postgres (5432) stay on `127.0.0.1`.

These steps assume Ubuntu with Nginx. Commands that change something are marked ⚠️; run them one at a time and read the output. **Never edit ShipTrack's own Nginx file**: HerCall gets its own.

Replace `hercall.example` with your real domain everywhere below.

## 0. Check what's already running

```bash
cat /etc/os-release | head -2
free -h && nproc && df -h /
node -v; npm -v; pm2 -v
systemctl is-active nginx postgresql
sudo ss -tlnp | grep -E ':(80|443|3100|5432) '
```

Port 3100 must be free. If something already uses it, pick another port and change it in `ecosystem.config.cjs` and `deploy/nginx-hercall.conf`.

## 1. Point the domain at the VPS

Hostinger hPanel → **Domains** → your domain → **DNS / Nameservers** → **DNS records**:

| Type | Name | Points to |
|---|---|---|
| A | `@` | your VPS IP |
| CNAME | `www` | your domain |

Delete any old `A` record for `@` that points elsewhere (for example a Hostinger parking page). DNS can take from a few minutes up to a few hours to update.

## 2. Node.js and PM2

Next.js 15 needs Node **18.18+** (20 or 22 recommended). If `node -v` shows an older version or nothing, install Node 22:

```bash
# ⚠️ only if Node is missing or older than 18.18
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

If ShipTrack already runs on an older Node, ask before upgrading, because it could affect ShipTrack.

If `pm2 -v` fails: ⚠️ `sudo npm install -g pm2`

## 3. Postgres database

If `systemctl is-active postgresql` didn't say `active`:

```bash
# ⚠️ install Postgres (listens on localhost only by default)
sudo apt install -y postgresql
```

Create a separate user and database for HerCall. This doesn't touch any existing ShipTrack data:

```bash
openssl rand -hex 24          # copy this, it's the database password

# ⚠️ create the user and database (paste the password in place of PASTE_PASSWORD)
sudo -u postgres psql -c "create role hercall login password 'PASTE_PASSWORD';"
sudo -u postgres psql -c "create database hercall owner hercall;"
```

## 4. Get the code

```bash
# ⚠️
sudo mkdir -p /var/www && cd /var/www
sudo git clone https://github.com/jatindiamondspc-sudo/fun.git hercall
sudo chown -R $USER:$USER /var/www/hercall
cd /var/www/hercall
```

Create the table:

```bash
psql "postgres://hercall:PASTE_PASSWORD@127.0.0.1:5432/hercall" -f db/schema.sql
```

## 5. Settings (`.env.local`)

```bash
cp .env.example .env.local
openssl rand -base64 18       # copy this, it's the /admin password
nano .env.local
```

Fill in:

```
DATABASE_URL=postgres://hercall:PASTE_PASSWORD@127.0.0.1:5432/hercall
ADMIN_USER=admin
ADMIN_PASSWORD=PASTE_ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL=https://hercall.example
```

Then lock the file down: `chmod 600 .env.local`

`NEXT_PUBLIC_*` values are baked in at build time, so rebuild (step 6) whenever you change them.

## 6. Build and start

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs   # ⚠️
pm2 save
curl -I http://127.0.0.1:3100    # should say 200 OK
```

If PM2 isn't set up to start on reboot yet (`pm2 startup` prints a command; run it once). If ShipTrack already uses PM2, this is probably done already.

## 7. Nginx + HTTPS

```bash
# ⚠️ add HerCall as its own site
sudo cp deploy/nginx-hercall.conf /etc/nginx/sites-available/hercall
sudo sed -i 's/hercall\.example/YOUR-DOMAIN/g' /etc/nginx/sites-available/hercall
sudo ln -s /etc/nginx/sites-available/hercall /etc/nginx/sites-enabled/hercall

# Test BEFORE reloading. If this fails, don't reload: it would affect ShipTrack too.
sudo nginx -t && sudo systemctl reload nginx
```

Once the domain's DNS points at the VPS, add HTTPS:

```bash
# ⚠️
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR-DOMAIN -d www.YOUR-DOMAIN
```

## 8. Firewall

Allow only SSH (22), HTTP (80) and HTTPS (443) from the internet. Use Hostinger hPanel → VPS → **Security → Firewall**, or `ufw` if that's what the server uses. Don't open 3100 or 5432.

## 9. Test it

1. Open `https://YOUR-DOMAIN`, sign up with your own number, and check you see "You're on the list!"
2. Open `https://YOUR-DOMAIN/admin`, log in with `ADMIN_USER` / `ADMIN_PASSWORD`, and check your signup is there.
3. Delete the test signup:

   ```bash
   psql "postgres://hercall:PASTE_PASSWORD@127.0.0.1:5432/hercall" -c "delete from waitlist where phone = 'YOUR10DIGITNUMBER';"
   ```

## Updating after code changes

```bash
cd /var/www/hercall
git pull
npm ci
npm run build
pm2 restart hercall
```

## Backups

The waitlist holds people's phone numbers, so back it up daily. ⚠️ Add a cron job with `sudo crontab -e`:

```
0 3 * * * mkdir -p /var/backups/hercall && runuser -u postgres -- pg_dump hercall | gzip > /var/backups/hercall/hercall-$(date +\%F).sql.gz && find /var/backups/hercall -name '*.sql.gz' -mtime +14 -delete
```

That keeps 14 days of backups on the VPS. Also turn on Hostinger's VPS backups/snapshots in hPanel, so a copy exists outside the server too.

## Logs

```bash
pm2 logs hercall          # app logs (signup errors show up here)
pm2 status
```
