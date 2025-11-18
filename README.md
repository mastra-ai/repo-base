# Repo Base - Chat with a repo

An intelligent chatbot that helps you understand and explore GitHub repositories through natural language conversations. Built with Next.js, Mastra AI, and powered by Google's Gemini 2.5 Flash.

## ✨ Features

- 🤖 **Intelligent Repository Analysis** - Ask questions about any public GitHub repository
- 💬 **Multi-Thread Conversations** - Maintain separate conversation threads for different repositories
- 🔍 **Deep Code Understanding** - Analyze repository structure, file contents, commits, issues, and pull requests
- 💾 **Persistent Memory** - Conversations are saved and can be resumed anytime
- ⚡ **Real-time Streaming** - Get responses as they're generated

## 📋 Prerequisites

- Node.js 20+ (recommended) or Bun
- Docker and Docker Compose
- A GitHub account (no token required for public repos)
- A Google AI API key (for Gemini)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DB_URL=postgresql://postgres:postgres@localhost:5432/repo_base

# Google AI API Key (get from https://aistudio.google.com/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Optional: GitHub Personal Access Token (for higher rate limits)
# GITHUB_TOKEN=your_github_token_here
```

### 3. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL 16 instance in a Docker container with persistent storage.

### 4. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Enter a Repository**: Type a GitHub repository in the format `owner/repo` (e.g., `facebook/react`)
2. **Start Chatting**: Ask questions about the repository:
   - "What is the project structure?"
   - "How does authentication work?"
   - "Show me the latest commits"
   - "What are the open issues?"
3. **Multiple Threads**: Create new conversation threads for the same repository or switch between different repositories

## 🤖 AI Agent Capabilities

The AI agent has access to the following tools:

- **getFilePaths**: Retrieves the complete file structure of a repository
- **getFileContent**: Fetches the content of specific files
- **getRepositoryCommits**: Analyzes commit history and recent changes
- **getRepositoryIssues**: Examines open and closed issues
- **getRepositoryPullRequests**: Reviews pull requests and code changes

## 🔗 Links

- [Mastra Documentation](https://mastra.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Assistant UI](https://www.assistant-ui.com/)
