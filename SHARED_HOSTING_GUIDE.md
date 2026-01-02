# Hosting Multiple Projects (LocalMarket, n8n, etc.)

This guide explains the best practices for hosting multiple applications (like **LocalMarketPWA** and **n8n**) on your infrastructure, whether on the same computer or different ones.

## Strategy: One Tunnel Per Application/Machine

Unlike the old Ngrok setup where we shared one domain, **Cloudflare Tunnels** are best used as "Dedicated Tunnels" for specific purposes.

### Scenario A: Different Machines (Recommended)
If you host **LocalMarket** on Machine A and **n8n** on Machine B:

1.  **Machine A (LocalMarket)**:
    -   Follow the `deployment_guide.md`.
    -   Create a tunnel named `localmarket`.
    -   Config: `ingress: hostname: lm.snapdecode.in -> service: http://localmarket-nginx:80`.

2.  **Machine B (n8n)**:
    -   Create a **separate** tunnel named `n8n`.
    -   Run `cloudflared tunnel create n8n`.
    -   Update DNS: `cloudflared tunnel route dns n8n n8n.snapdecode.in`.
    -   Config `config.yml`:
        ```yaml
        ingress:
          - hostname: n8n.snapdecode.in
            service: http://n8n:5678  # Or http://localhost:5678 if running locally
          - service: http_status:404
        ```

---

### Scenario B: Same Machine (Shared Hosting)
If you want to host both on the **same** computer (e.g., `C:\Projects\localmarketpwa` and `C:\Projects\n8n`):

#### option 1: Separate Tunnels (Easiest)
You can simply run two Docker Compose stacks, each with its own `cloudflared` container.
-   **LocalMarket Stack**: Has its own tunnel config for `lm.snapdecode.in`.
-   **n8n Stack**: Has its own tunnel config for `n8n.snapdecode.in`.

This is the most robust method. If one crashes, the other stays up.

#### Option 2: Single "Gateway" Tunnel (Advanced)
You run **one** Cloudflare Tunnel that manages traffic for ALL your apps.

1.  **Create a central `cloudflared` folder**:
    e.g., `C:\Gateway\cloudflared`.

2.  **Create a shared network**:
    ```powershell
    docker network create shared_web
    ```

3.  **Connect Apps to Network**:
    Add `shared_web` to `docker-compose.yml` of **LocalMarket** AND **n8n**.
    -   `localmarket-nginx` container joins `shared_web`.
    -   `n8n` container joins `shared_web`.

4.  **Configure Gateway Tunnel**:
    Your single `config.yml` will look like this:
    ```yaml
    ingress:
      - hostname: lm.snapdecode.in
        service: http://localmarket-nginx:80
      - hostname: n8n.snapdecode.in
        service: http://n8n:5678
      - service: http_status:404
    ```

5.  **Run the Gateway**:
    Run this single tunnel using Docker or the Windows Service.

---

## Deploying n8n (Fast Track)

If you want to deploy n8n now on a different port/machine:

1.  **Folder Setup**: `mkdir C:\Projects\n8n`
2.  **Docker Compose**:
    ```yaml
    version: '3'
    services:
      n8n:
        image: n8nio/n8n
        ports:
          - "5678:5678"
        volumes:
          - n8n_data:/home/node/.n8n
        restart: always
        
      cloudflared:
        image: cloudflare/cloudflared
        command: tunnel run
        volumes:
          - ./cloudflared:/etc/cloudflared
    
    volumes:
      n8n_data:
    ```
3.  **Tunnel Config**: Follow the same steps as LocalMarket (Create Tunnel -> Create Config -> Route DNS).
