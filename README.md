# Git-commit-Project
GitHub Commit Diff Viewer

Overview:
This project is a web application that allows users to view code differences for any given commit from an open-source GitHub repository. The application consists of a React frontend and an Express.js backend that interacts with the GitHub API to fetch commit details and diffs.

Installation
Prerequisites
Node.js & npm installed
Git installed
A GitHub personal access token (for API requests)

Setup
1. Clone the Repository 
2. Backend Setup
cd backend  
npm install  
echo "GITHUB_TOKEN=your_token" > .env  
npm start

4. Frontend Setup
cd frontend  
npm install  
npm start  

Usage
Open your browser and visit:
http://localhost:3000/repositories/golemfactory/clay/commits/a1bf367b3af680b1182cc52bb77ba095764a11f9
