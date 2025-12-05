# Rutics Board - Kanban Dashboard

A modern, responsive Kanban board application built with TypeScript, Vite, and Tailwind CSS. Rutics Board helps teams organize tasks, track project progress, and collaborate effectively.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Drag and Drop Tasks**: Easily move tasks between columns (Up Next, In Progress, In Review) using intuitive drag-and-drop
- **Project Management**: Create, star, and manage multiple projects with custom color themes
- **Task Status Tracking**: Mark tasks with statuses like Blocked, Paused, Cancelled, or Done
- **Task Archiving**: Archive completed tasks and restore them when needed
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Local Storage Persistence**: All data is automatically saved to localStorage
- **Data Import/Export**: Export and import board data as JSON files
- **Approval Workflow**: Tasks in the "In Review" column support approval actions

## 🛠️ Tech Stack

- **Frontend Framework**: Vanilla TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [daisyUI](https://daisyui.com/)
- **Drag & Drop**: [SortableJS](https://sortablejs.github.io/Sortable/)
- **Icons**: [Font Awesome](https://fontawesome.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyanshusaini105/rutics-board-frontend.git
   cd rutics-board-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### Creating a New Task

1. Click the **"+ Add Task"** button in the top right corner
2. Fill in the task details:
   - Task title (required)
   - Column (Up Next, In Progress, or In Review)
   - Assignee name
   - Project
   - Time estimate
   - Status (optional)
3. Click **"Add Task"** to create

### Managing Projects

1. Click the **"+"** button next to "Projects" in the sidebar
2. Enter a project name and select a color theme
3. Click **"Add Project"** to create
4. Star important projects by clicking the star icon
5. Delete projects by clicking the trash icon

### Moving Tasks

- **Drag and drop** tasks between columns to change their status
- Tasks automatically save their new position

### Archiving Tasks

1. Hover over a task card
2. Click the archive icon to archive the task
3. Access archived tasks via **"Archive"** in the sidebar
4. Restore or permanently delete archived tasks

### Console Commands

For advanced users, the following console commands are available:

```javascript
// Add a sample task
addSampleTask()

// Reset board to default data
resetBoard()

// Export board data as JSON
exportBoard()

// Access the Kanban board instance
kanban.addTask(columnId, taskData)
kanban.removeTask(taskId)
kanban.archiveTask(taskId)
kanban.restoreTask(taskId)
kanban.addProject(projectData)
kanban.removeProject(projectId)
```

## 📁 Project Structure

```
rutics-board-frontend/
├── public/              # Static assets
├── src/
│   ├── main.ts          # Main application entry point
│   ├── styles.css       # Global styles
│   └── vite-env.d.ts    # Vite environment types
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use `data-` attributes for event listener selectors
- Keep event listeners in JavaScript, not inline HTML

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👏 Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [daisyUI](https://daisyui.com/) - Component library for Tailwind CSS
- [SortableJS](https://sortablejs.github.io/Sortable/) - Drag and drop library
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Vite](https://vitejs.dev/) - Next-generation frontend build tool

---

Made with ❤️ by [Priyanshu Saini](https://github.com/priyanshusaini105)
