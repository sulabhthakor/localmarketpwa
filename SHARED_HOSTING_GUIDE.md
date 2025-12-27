# Hosting LocalMarketPWA and n8n on the Same Ngrok Domain

This guide explains how to host both applications on `https://endless-wren-mentally.ngrok-free.app` using a shared Nginx reserve proxy.

## Architecture
- **URL**: `https://.../` -> Routes to **LocalMarketPWA**
- **URL**: `https://.../n8n/` -> Routes to **n8n**

## Step 1: Create the Shared Network
Both Docker projects need to talk to each other. Create a shared network that they can both attach to.

1.  Open **PowerShell**.
2.  Run:
    ```powershell
    docker network create shared_web
    ```

## Step 2: Configure LocalMarketPWA
(This step is already done if you are using the updated `docker-compose.yml`)

1.  Navigate to `C:\Projects\localmarketpwa`.
2.  Start the updated stack:
    ```powershell
    docker-compose down
    docker-compose up -d --build
    ```
    *This starts Nginx on port 80.*

## Step 3: Configure n8n
You need to update your **n8n** `docker-compose.yml` file to join the `shared_web` network.

1.  Open your **n8n** `docker-compose.yml` file.
2.  **Add the Network**:
    Add the `networks` block to the bottom of the file (outside services) and to the `n8n` service itself.

    ```yaml
    services:
      n8n:
        container_name: n8n  # <--- CRITICAL: MUST BE NAMED 'n8n'
        image: n8nio/n8n
        # ... other settings ...
        environment:
          - N8N_PATH=/n8n/  # <--- CRITICAL: Tells n8n it is served under /n8n/
          - WEBHOOK_URL=https://endless-wren-mentally.ngrok-free.app/n8n/
        networks:
          - shared_web      # <--- Add this
          - default

    networks:
      shared_web:           # <--- Add this block at the end of file
        external: true
    ```

3.  **Restart n8n**:
    ```powershell
    docker-compose down
    docker-compose up -d
    ```

## Step 4: Connect Ngrok
Now point Ngrok to the **Nginx** container (Port 80), not directly to n8n or Next.js.

1.  Run Ngrok:
    ```powershell
    ngrok http 80
    ```
    *(Or however you usually start your static domain)*

2.  **Verify**:
    - Go to `https://endless-wren-mentally.ngrok-free.app` -> Should see **LocalMarket**.
    - Go to `https://endless-wren-mentally.ngrok-free.app/n8n/` -> Should see **n8n**.
