# Deployment Guide: LocalMarketPWA + Cloudflare Tunnel

This guide provides a comprehensive, step-by-step walkthrough to deploy the **LocalMarketPWA** application on a fresh Windows machine using **Docker Desktop** and **Cloudflare Tunnel**.

By following this guide, you will:
1.  Set up the necessary tools (Docker, Git).
2.  Clone the project code.
3.  Configure environment variables.
4.  Configure the Cloudflare Tunnel credentials.
5.  Launch the application stack (Next.js + Postgres + Nginx + Cloudflare).
6.  Verify the deployment.

---

## 1. Prerequisites

Before starting, the host computer must have the following installed:

### 1.1 Install Git for Windows
-   **Download**: [https://git-scm.com/download/win](https://git-scm.com/download/win)
-   **Action**: Run the installer with default settings (Next, Next, Next...).
-   **Verify**: Open **Command Prompt** or **PowerShell** and run:
    ```powershell
    git --version
    ```

### 1.2 Install Docker Desktop
-   **Download**: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
-   **Action**: Run the installer. A restart may be required.
-   **Verify**:
    1.  Open **Docker Desktop** from the Start menu.
    2.  Wait until the whale icon in the bottom-left corner turns **Green**.
    3.  Open PowerShell and run:
        ```powershell
        docker ps
        ```
        (It should show a header line and no errors).

---

## 2. Get the Code

1.  **Create a Folder**:
    Open PowerShell and create a directory for your projects:
    ```powershell
    mkdir C:\Projects
    cd C:\Projects
    ```

2.  **Clone the Repository**:
    ```powershell
    git clone https://github.com/sulabhthakor/localmarketpwa.git
    cd localmarketpwa
    ```

---

## 3. Configuration Setup

### 3.1 Environment Secrets (`.env.local`)
The application needs a `.env.local` file for database passwords and API keys.

1.  **Create the file**:
    ```powershell
    cd code
    copy env.example .env.local
    ```

2.  **Edit the file**:
    Open the file in Notepad to set your passwords:
    ```powershell
    notepad .env.local
    ```

3.  **Required Changes**:
    Find `DB_HOST` and change it to `postgres`:
    ```ini
    DB_HOST=postgres
    ```
    *Note: Inside Docker, we refer to other containers by their service name (`postgres`), not `localhost`.*

    Update other keys (`JWT_SECRET`, etc.) as needed. Save and close.

### 3.2 Cloudflare Tunnel Configuration
We use **Cloudflare Tunnel** to expose the local site to the internet securely.

1.  **Create Directory**:
    Navigate back to the project root (`localmarketpwa`) and create a folder for tunnel config:
    ```powershell
    cd ..
    mkdir cloudflared
    ```

2.  **Get Credentials**:
    *If you have already created a tunnel on another machine, copy the JSON file here.*
    *If creating a new tunnel:*
    -   Download `cloudflared` for Windows: [https://github.com/cloudflare/cloudflared/releases](https://github.com/cloudflare/cloudflared/releases)
    -   Run `cloudflared tunnel login` to authenticate.
    -   Run `cloudflared tunnel create localmarket`.
    -   It will generate a JSON file (e.g., `4985a2e0...json`).

3.  **Place Credentials**:
    Copy your JSON credentials file into `C:\Projects\localmarketpwa\cloudflared\`.

4.  **Create `config.yml`**:
    Create a file named `config.yml` inside `C:\Projects\localmarketpwa\cloudflared\` with the following content:
    *Replace `TUNNEL_ID` with your actual ID from the JSON filename.*

    ```yaml
    tunnel: TUNNEL_ID
    credentials-file: /etc/cloudflared/TUNNEL_ID.json

    ingress:
      - hostname: lm.snapdecode.in
        service: http://localmarket-nginx:80
      - service: http_status:404
    ```
    > **CRITICAL**: ensure `service` points to `http://localmarket-nginx:80`.

---

## 4. Launch the Application

Now we build and start the entire system (Database, App, Web Server, Tunnel) with one command.

1.  **Run Docker Compose**:
    Ensure you are in `C:\Projects\localmarketpwa`:
    ```powershell
    docker-compose up -d --build
    ```

2.  **Wait for Build**:
    Docker will download necessary images (Node.js, Postgres, Nginx) and build your application. This may take 5-10 minutes the first time.

3.  **Check Status**:
    Run:
    ```powershell
    docker ps
    ```
    You should see 4 containers running:
    -   `localmarketpwa-nextjs-app-1`
    -   `localmarketpwa-postgres-1`
    -   `localmarket-nginx`
    -   `localmarketpwa-cloudflared-1`

---

## 5. Initialize Database

The first time you run the app, the database is empty.

1.  **Run Migration Script**:
    ```powershell
    cd code
    npx tsx scripts/init-db.ts
    ```
2.  **Success**: You should see "Database initialized successfully".

---

## 6. Verification & Troubleshooting

### 6.1 Verify Deployment
Open your browser and visit your domain (e.g., `https://lm.snapdecode.in`).
-   Home page should load.
-   Visit `/products`. It should load without "502 Bad Gateway".

### 6.2 Common Issues

#### Issue: "502 Bad Gateway"
-   **Cause**: Nginx or Next.js is down, or Cloudflare can't reach Nginx.
-   **Fix 1 (Restart Tunnel)**:
    Sometimes the tunnel starts before Nginx is ready.
    ```powershell
    docker-compose restart cloudflared
    ```
-   **Fix 2 (Check Network)**:
    Ensure `config.yml` says `service: http://localmarket-nginx:80`.

#### Issue: "Database Connection Error"
-   **Cause**: `DB_HOST` is wrong or Postgres isn't running.
-   **Fix**: Check `.env.local`. `DB_HOST` must be `postgres`. Check `docker ps` to see if postgres is running.

#### Issue: "Docker failed to connect"
-   **Cause**: Docker Desktop is not running.
-   **Fix**: Open Docker Desktop and wait for the green light.
