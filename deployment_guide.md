# Deploying LocalMarketPWA on a New Windows Device

This guide provides step-by-step instructions for hosting the **LocalMarketPWA** project on a *fresh* Windows computer using Docker Desktop.

---

## 1. Prerequisites (Do this first)

Before you begin, ensure the target "Server" or "Host" computer has the following installed:

1.  **Docker Desktop**:
    *   Download and install from: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
    *   **Action**: Run the installer and restart your computer if asked.
    *   **Verify**: Open Docker Desktop and ensure the engine is running (bottom left corner should be green).

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
        cd localmarketpwa/code
        ```

---

## 3. Configure Environment Variables

The app needs secrets (like database passwords) to run. These are not stored in GitHub for security, so you must create them manually.

1.  **Create the `.env.local` file**:
    *   In the same PowerShell window, run:
        ```powershell
        copy env.example .env.local
        ```

2.  **Edit the file**:
    *   You can open this file with Notepad to fill in your real values:
        ```powershell
        notepad .env.local
        ```
    *   **Critical**: Update `DB_HOST`, `DB_PASSWORD`, `JWT_SECRET`, etc., with your actual production values.
    *   *Save and close Notepad.*

    > **Important**: Since we are running in Docker, you might strictly rely on `docker-compose.yml` environment variables, but having a `.env.local` is good practice if you mapped it in the compose file.

---

## 4. Start the Application

Now we use Docker to build and run the app.

1.  **Run the Docker Command**:
    *   In the `C:\Projects\localmarketpwa\code` directory (where you are now), run:
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

---

## 5. How to Update the App (Future Updates)

When you push new code to GitHub from your developer machine, follow these steps on this **Host Machine** to update it:

1.  **Open PowerShell** and go to the folder:
    ```powershell
    cd C:\Projects\localmarketpwa\code
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
cd C:\Projects\localmarketpwa\code
docker-compose up -d --build
```

**Update:**
```powershell
cd C:\Projects\localmarketpwa\code
git pull origin main
docker-compose up -d --build
```
