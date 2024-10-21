This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

# LLM Task Tracker
This is a Next.js-based task management application that is able to perform: task creation, editing, deletion, calendar, and email text generation via a local LLM of your choice served by ollama.

Here is a short video demonstrating what the app can do so far. The tasks right now are not saved upon refresh as the storage part has not been implemented yet.
<video src="https://github.com/user-attachments/assets/aa3e3b8e-740c-42e0-97a2-b128ecc550e7" width="1270" />

## Dependencies
This project requires Node.js and npm. The following dependencies need to be installed:

- Next.js
- React
- React DOM
- Lucide React
- Ollama
- Tailwind CSS

## Installation
1. Clone the repository:
git clone https://github.com/yomogiu/task-tracker.git
cd task-tracker

2. Install the dependencies:
npm install

## Running the Application
To run the development server:
npm run dev
Open [http://localhost:3000](http://localhost:3000) with your browser.
Start ollama

## Project Structure
- `pages/`: Contains the Next.js pages
- `pages/api`: Ollama api to interact with the model (configure system prompt and model here)
- `components/`: React components used in the application
- `styles/`: CSS files, including Tailwind CSS

## Features

- Task creation and management
- Monthly calendar view
- Task summary and statistics
- Email generation for tasks powered by a local LLM

## Dependencies

- Next.js
- React
- Tailwind CSS
- Lucide React (for icons)
- Ollama (for AI-assisted email generation)

## TODO

- Add storage so the tasks are saved (probably JSON or SQLite...)
- Some kind of config/settings page where user can easily change things like system prompt or some other way to serve their LLM (e.g., OpenAI API)
- Dark mode maybe
