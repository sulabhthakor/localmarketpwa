# Deploying LocalMarketPWA on a New Windows Device

This guide provides step-by-step instructions for hosting the **LocalMarketPWA** project on a *fresh* Windows computer using Docker Desktop.

---

## 1. Prerequisites (Do this first)

Before you begin, ensure the target "Server" or "Host" computer has the following installed:

1.  **Docker Desktop**:
    *   Download and install from: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
    *   **Action**: Run the installer and restart your computer if asked.
    *   **Verify**: Open Docker Desktop and ensure the engine is running (bottom left corner should be green).

    *Note: You do NOT need to install PostgreSQL manually. Docker will download and run it for you.*

2.  **Git for Windows**:
    *   Download and install from: [https://git-scm.com/download/win](https://git-scm.com/download/win)
    *   **Action**: Run the installer with default settings.
    *   **Verify**: Open "Command Prompt" or "PowerShell" and type `git --version`.

---

## 2. Get the Code (Clone the Repository)

We need to download the project code from GitHub to your new machine.

1.  **Open PowerShell**:
    *   Press `Win + X` and select **Windows PowerShell** or **Terminal**.

2.  **Create a Folder**:
    *   Run this command to create a folder for your projects (e.g., `C:\Projects`):
        ```powershell
        mkdir C:\Projects
        cd C:\Projects
        ```

3.  **Clone the Repository**:
    *   Run this command to download the code (replace `YOUR_GITHUB_URL` with the actual URL of your repository):
        ```powershell
        git clone https://github.com/sulabhthakor/localmarketpwa.git
        ```
    *   *Note: If your repository is private, it will ask for your GitHub username and password/token.*

4.  **Enter the Project Directory**:
    *   Navigate into the code folder where the Docker files are located:
        ```powershell
        cd localmarketpwa
        ```

---

## 3. Configure Environment Variables

The app needs secrets (like database passwords) to run. These are not stored in GitHub for security, so you must create them manually.

1.  **Create the `.env.local` file**:
    *   In the same PowerShell window:
        ```powershell
        cd code
        copy env.example .env.local
        cd ..
        ```

2.  **Edit the file**:
    *   You can open this file with Notepad to fill in your real values:
        ```powershell
        notepad code/.env.local
        ```
    *   **Critical**: Update `DB_PASSWORD`, `JWT_SECRET`, etc., with your actual production values.
    *   **VERY IMPORTANT**: Set `DB_HOST=postgres` (instead of `localhost`). This tells the app to talk to the database container.
    *   *Save and close Notepad.*

    > **Important**: Since we are running in Docker, you might strictly rely on `docker-compose.yml` environment variables, but having a `.env.local` is good practice if you mapped it in the compose file.

---

## 4. Start the Application

Now we use Docker to build and run the app.

1.  **Run the Docker Command**:
    *   In the `C:\Projects\localmarketpwa` directory (where you are now), run:
        ```powershell
        docker-compose up -d --build
        ```

    *   **What this does**:
        *   `up`: Starts the containers defined in `docker-compose.yml`.
        *   `-d`: Detached mode (runs in the background so you can close the terminal).
        *   `--build`: Builds the image from the `Dockerfile` before starting.

2.  **Wait**:
    *   You will see output like `Building nextjs-app...` and steps like `[+] Building 123.4s`. This creates the virtual "computer" (container) for your app.
    *   Once done, it will say `Started`.

3.  **Verify**:
    *   Open your web browser (Chrome/Edge).
    *   Go to: `http://localhost:3000`.
    *   You should see your application running!
    *   *Note: If you see "Internal Server Error" or empty data, you probably need to initialize the database (see below).*

---

## 5. Initialize the Database
The first time you run the app, the database is empty. You need to create the tables.

1.  **Run the Initialization Script**:
    *   In your PowerShell window (ensure you are in `C:\Projects\localmarketpwa`):
        ```powershell
        cd code
        npx tsx scripts/init-db.ts
        cd ..
        ```
    *   It should say "Database initialized successfully."

---

## 6. Troubleshooting Common Issues

### Build Failures
If you see errors during `docker-compose up --build`:
1.  **Check Logs**: Run `docker-compose logs -f nextjs-app` to see detailed error messages.
2.  **Clean Build**: Sometimes old data causes issues. Run:
    ```powershell
    docker-compose down -v
    docker-compose up -d --build
    ```
    *(Note: `-v` deletes the database volume! Only do this if you don't care about the data or have a backup.)*

### Application Not Accessible
If you can't access `http://localhost:3000`:
1.  **Check Container Status**: Run `docker ps`. Ensure `nextjs-app` suggests it is "Up".
2.  **Port Conflicts**: Ensure no other app is using port 3000. If so, change the port in `docker-compose.yml` (e.g., `"3001:3000"`) and try again.

---

## 7. Importing an Existing Database (Optional)

**Important**: If you have already run the "Initialize the Database" step (Section 5), you must **reset the database** before importing a full backup. Creating tables on top of existing ones will cause errors.

1.  **Reset Database (If needed)**:
    ```powershell
    docker-compose down -v
    docker-compose up -d
    ```
    *(Wait 10 seconds for the database to start up. **Do NOT** run `init-db.ts`.)*

2.  **Place the file**: Copy your `backup.sql` file into the `C:\Projects\localmarketpwa` folder.
3.  **Copy to Container**:
    ```powershell
    docker cp backup.sql localmarketpwa-postgres-1:/tmp/backup.sql
    ```
4.  **Import Data**:
    ```powershell
    docker exec -it localmarketpwa-postgres-1 psql -U postgres -d localmarket -f /tmp/backup.sql
    ```
    
---

## 8. How to Update the App (Future Updates)

When you push new code to GitHub from your developer machine, follow these steps on this **Host Machine** to update it:

1.  **Open PowerShell** and go to the folder:
    ```powershell
    cd C:\Projects\localmarketpwa
    ```

2.  **Download Updates**:
    ```powershell
    git pull origin main
    ```

3.  **Rebuild and Restart**:
    ```powershell
    docker-compose up -d --build
    ```
    *   Docker is smart; it will only rebuild what changed. This will replace the old running version with the new one automatically.

---

## Summary of Commands

**Install/Start:**
```powershell
cd C:\Projects\localmarketpwa
docker-compose up -d --build
```

**Update:**
```powershell
cd C:\Projects\localmarketpwa
git pull origin main
docker-compose up -d --build
```
