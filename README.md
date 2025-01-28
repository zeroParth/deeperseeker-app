# Deeper Seeker

## Getting Started with Cursor

This guide will help you get started even if you're new to coding, using Cursor (an AI-powered code editor) to help you along the way.

### Prerequisites

1. Download and install [Cursor](https://cursor.sh/) - it's a free AI-powered code editor
2. Install [Git](https://git-scm.com/downloads) - this helps manage code versions
3. Install [Node.js](https://nodejs.org/) - choose the LTS (Long Term Support) version

### Step-by-Step Instructions

1. **Clone the Repository**
   - Fork the repository on GitHub
   - Open Cursor
   - Press `Cmd + L`
   - Type `Clone this repo and run it {{PASTE_YOUR_REPO_URL_HERE}}`
   - Press Enter

2. **Setup Authentication**
   - Go to https://clerk.com/
   - Create a new project
   - Get your Clerk Publishable Key
   - Rename the `.env.example` file to `.env`
   - Add your Clerk Publishable Key to the `.env` file after the = sign or ask Cursor to do it for you
   
3. **Install Dependencies**
   - Open the terminal in Cursor (View → Terminal or `` Ctrl + ` ``) or ask Cursor to install dependencies
   - Type `bun install` and press Enter
   - Wait for all dependencies to install

4. **Run the Project**
   - In the terminal, type `bun ios` or ask Cursor to run the project
   - The project should open in your iOS simulator


## Credits

This project was inspired by and built upon the foundation of [ChatGPT Clone React Native](https://github.com/Galaxies-dev/chatgpt-clone-react-native) by Galaxies-dev.