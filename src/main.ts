import './styles.css';
import Sortable from 'sortablejs';

// Dynamic Kanban Board with JSON Data Management
class KanbanBoard {
  private storageKey = 'kanban-board-data';
  public data: any;

  constructor() {
    this.data = this.loadData();
    this.init();
  }

  // Initialize the board
  init() {
    this.renderProjects();
    this.renderAllTasks();
    this.initializeDragAndDrop();
    this.updateAllColumnCounts();
    this.populateProjectDropdown();
    console.log('Dynamic Kanban board initialized successfully!');
  }

  // Load data from localStorage or return default data
  loadData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored data:', e);
        return this.getDefaultData();
      }
    }
    return this.getDefaultData();
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    console.log('Data saved to localStorage');
  }

  // Get default board data
  getDefaultData() {
    return {
      projects: [
        { id: 'mast', name: 'Mast', starred: true, color: 'fuchsia' },
        { id: 'bluejay', name: 'Bluejay', starred: true, color: 'blue' },
        { id: 'dabble', name: 'Dabble', starred: false, color: 'purple' },
        { id: 'highlight', name: 'Highlight', starred: false, color: 'cyan' },
        { id: 'figmate', name: 'Figmate', starred: false, color: 'orange' },
        { id: 'gwp', name: 'GWP', starred: false, color: 'green' },
        { id: 'launchpad', name: 'LaunchPad', starred: false, color: 'violet' },
        { id: 'rev', name: 'Rev', starred: false, color: 'red' }
      ],
      columns: {
        'up-next': {
          id: 'up-next',
          title: 'Up Next',
          tasks: [
            {
              id: 'task-1',
              title: 'Update ticket designs in modal.',
              assignee: 'Brantley Mathis',
              project: 'Mast',
              projectColor: 'fuchsia',
              time: '20h',
              avatar: 'https://picsum.photos/20?6'
            },
            {
              id: 'task-2',
              title: 'Create page layout for onboarding.',
              assignee: 'Sarah Wilson',
              project: 'Bluejay',
              projectColor: 'blue',
              time: '15h',
              avatar: 'https://picsum.photos/20?1'
            },
            {
              id: 'task-3',
              title: 'Polish designs and reach out to dev.',
              assignee: 'Alex Chen',
              project: 'Dabble',
              projectColor: 'purple',
              time: '8h',
              avatar: 'https://picsum.photos/20?2'
            },
            {
              id: 'task-4',
              title: 'Remote user approvals/comments',
              assignee: 'Jordan Taylor',
              project: 'GWP',
              projectColor: 'green',
              time: '12h',
              avatar: 'https://picsum.photos/20?3'
            },
            {
              id: 'task-5',
              title: 'Redo landing page for Sono Dojo',
              assignee: 'Morgan Davis',
              project: 'Figmate',
              projectColor: 'orange',
              time: '25h',
              avatar: 'https://picsum.photos/20?4'
            }
          ]
        },
        'in-progress': {
          id: 'in-progress',
          title: 'In Progress',
          tasks: [
            {
              id: 'task-6',
              title: 'Include lien waiver questionnaire statement.',
              assignee: 'Ivan Erickson',
              project: 'Bluejay',
              projectColor: 'blue',
              time: '5h',
              avatar: 'https://picsum.photos/20?7'
            },
            {
              id: 'task-7',
              title: 'Button Styling Concepts',
              assignee: 'Tori Bates',
              project: 'Mast',
              projectColor: 'fuchsia',
              time: '10h',
              avatar: 'https://picsum.photos/20?8'
            }
          ]
        },
        'in-review': {
          id: 'in-review',
          title: 'In Review',
          tasks: [
            {
              id: 'task-8',
              title: 'Add Search Bar.',
              assignee: 'Sabrina Dobson',
              project: 'Highlight',
              projectColor: 'cyan',
              hasApproval: true,
              avatar: 'https://picsum.photos/20?9'
            },
            {
              id: 'task-9',
              title: 'Update Material Editor Info.',
              assignee: 'Ellis Ochoa',
              project: 'LaunchPad',
              projectColor: 'violet',
              hasApproval: true,
              avatar: 'https://picsum.photos/20?10'
            },
            {
              id: 'task-10',
              title: 'Add Membership Renewal Button.',
              assignee: 'Glenn Jones',
              project: 'Rev',
              projectColor: 'red',
              hasApproval: true,
              avatar: 'https://picsum.photos/20?11'
            }
          ]
        }
      }
    };
  }

  // Create a task element from data
  createTaskElement(task: any) {
    const article = document.createElement('article');
    article.className = 'mx-2 rounded-lg border border-zinc-800 bg-zinc-800/60 p-3 shadow-sm hover:border-zinc-700';
    article.setAttribute('data-kanban-task', 'true');
    article.setAttribute('data-task-id', task.id);

    // Project color mapping
    const colorMap: { [key: string]: string } = {
      'fuchsia': 'bg-fuchsia-700/40 text-fuchsia-300',
      'blue': 'bg-blue-700/40 text-blue-300',
      'purple': 'bg-purple-700/40 text-purple-300',
      'green': 'bg-green-700/40 text-green-300',
      'orange': 'bg-orange-700/40 text-orange-300',
      'cyan': 'bg-cyan-700/40 text-cyan-300',
      'violet': 'bg-violet-700/40 text-violet-300',
      'red': 'bg-red-700/40 text-red-300',
      'yellow': 'bg-yellow-700/40 text-yellow-300',
      'pink': 'bg-pink-700/40 text-pink-300'
    };

    const projectColorClass = colorMap[task.projectColor] || 'bg-gray-700/40 text-gray-300';

    // Create approval button for review tasks
    const approvalButton = task.hasApproval ? `
      <div class="mt-2 flex gap-2">
        <button data-action="approve-task" data-task-id="${task.id}" class="px-2 py-1 text-[12px] rounded bg-emerald-700/40 text-emerald-300 border border-emerald-800/60">
          Approve
        </button>
      </div>
    ` : '';

    // Create time display for non-review tasks
    const timeDisplay = task.time ? `<span class="text-[11px] text-zinc-400">${task.time}</span>` : '';

    article.innerHTML = `
      <header class="flex items-start justify-between">
        <h3 class="text-sm font-medium">${task.title}</h3>
        ${timeDisplay}
      </header>
      ${approvalButton}
      <footer class="mt-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img class="h-5 w-5 rounded-full" src="${task.avatar}" alt="${task.assignee}">
          <span class="text-xs text-zinc-300">${task.assignee}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="rounded ${projectColorClass} px-2 py-0.5 text-[11px]">${task.project}</span>
        </div>
      </footer>
    `;

    return article;
  }

  // Render projects in the sidebar
  renderProjects() {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;

    projectList.innerHTML = '';

    this.data.projects.forEach((project: any) => {
      const li = document.createElement('li');
      
      if (project.starred) {
        li.innerHTML = `
          <a class="flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 text-zinc-300" href="#" data-project-id="${project.id}">
            <span class="truncate">${project.name}</span>
            <span class="text-amber-400">★</span>
          </a>
        `;
      } else {
        li.innerHTML = `
          <a class="block px-2 py-2 rounded-md hover:bg-zinc-800 text-zinc-300" href="#" data-project-id="${project.id}">
            ${project.name}
          </a>
        `;
      }

      projectList.appendChild(li);
    });

    console.log('Projects rendered in sidebar');
  }

  // Toggle project star status
  toggleProjectStar(projectId: string) {
    const project = this.data.projects.find((p: any) => p.id === projectId);
    if (project) {
      project.starred = !project.starred;
      this.saveData();
      this.renderProjects();
      console.log(`Project ${project.name} star toggled to ${project.starred}`);
    }
  }

  // Render all tasks in all columns
  renderAllTasks() {
    Object.keys(this.data.columns).forEach(columnId => {
      this.renderColumnTasks(columnId);
    });
  }

  // Render tasks for a specific column
  renderColumnTasks(columnId: string) {
    const column = document.querySelector(`[data-kanban-column="${columnId}"]`);
    const columnData = this.data.columns[columnId];
    
    if (!column || !columnData) return;

    // Clear existing tasks
    column.innerHTML = '';

    // Add tasks
    columnData.tasks.forEach((task: any) => {
      const taskElement = this.createTaskElement(task);
      column.appendChild(taskElement);
    });

    this.updateColumnCount(columnId);
  }

  // Update column count badge
  updateColumnCount(columnId: string) {
    const column = document.querySelector(`[data-kanban-column="${columnId}"]`);
    if (!column) return;

    const countBadge = column.closest('.bg-zinc-900')?.querySelector('.text-zinc-400');
    const taskCount = this.data.columns[columnId]?.tasks.length || 0;
    
    if (countBadge) {
      countBadge.textContent = taskCount.toString();
    }
  }

  // Update all column counts
  updateAllColumnCounts() {
    Object.keys(this.data.columns).forEach(columnId => {
      this.updateColumnCount(columnId);
    });
  }

  // Move task between columns
  moveTask(taskId: string, fromColumnId: string, toColumnId: string) {
    const fromColumn = this.data.columns[fromColumnId];
    const toColumn = this.data.columns[toColumnId];

    if (!fromColumn || !toColumn) return;

    // Find task in source column
    const taskIndex = fromColumn.tasks.findIndex((task: any) => task.id === taskId);
    if (taskIndex === -1) return;

    // Move task
    const task = fromColumn.tasks.splice(taskIndex, 1)[0];
    toColumn.tasks.push(task);

    // Save data
    this.saveData();

    console.log(`Task "${task.title}" moved from ${fromColumnId} to ${toColumnId}`);
  }

  // Add new task
  addTask(columnId: string, taskData: any) {
    const column = this.data.columns[columnId];
    if (!column) return;

    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title || 'New Task',
      assignee: taskData.assignee || 'Unassigned',
      project: taskData.project || 'General',
      projectColor: taskData.projectColor || 'gray',
      time: taskData.time || '',
      avatar: taskData.avatar || 'https://picsum.photos/20?0',
      hasApproval: columnId === 'in-review'
    };

    column.tasks.push(newTask);
    this.saveData();
    this.renderColumnTasks(columnId);

    console.log(`New task "${newTask.title}" added to ${columnId}`);
    return newTask;
  }

  // Remove task
  removeTask(taskId: string) {
    Object.keys(this.data.columns).forEach(columnId => {
      const column = this.data.columns[columnId];
      const taskIndex = column.tasks.findIndex((task: any) => task.id === taskId);
      if (taskIndex !== -1) {
        const removedTask = column.tasks.splice(taskIndex, 1)[0];
        this.saveData();
        this.renderColumnTasks(columnId);
        console.log(`Task "${removedTask.title}" removed from ${columnId}`);
        return;
      }
    });
  }

  // Approve task (for review column)
  approveTask(taskId: string) {
    // Move task from in-review to a completed state or remove it
    console.log(`Task ${taskId} approved`);
    // You can implement moving to a "done" column or removing the task
    this.removeTask(taskId);
  }

  // Add new project
  addProject(projectData: any) {
    const newProject = {
      id: projectData.name.toLowerCase().replace(/\s+/g, '-'),
      name: projectData.name,
      starred: projectData.starred || false,
      color: projectData.color || 'blue'
    };

    this.data.projects.push(newProject);
    this.saveData();
    this.renderProjects();
    this.populateProjectDropdown();

    console.log(`New project "${newProject.name}" added`);
    return newProject;
  }

  // Remove project
  removeProject(projectId: string) {
    const index = this.data.projects.findIndex((p: any) => p.id === projectId);
    if (index !== -1) {
      const removedProject = this.data.projects.splice(index, 1)[0];
      this.saveData();
      this.renderProjects();
      this.populateProjectDropdown();
      console.log(`Project "${removedProject.name}" removed`);
      return removedProject;
    }
  }

  // Populate project dropdown in task form
  populateProjectDropdown() {
    const projectSelect = document.getElementById('taskProject') as HTMLSelectElement;
    if (!projectSelect) return;

    projectSelect.innerHTML = '';
    
    this.data.projects.forEach((project: any) => {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      projectSelect.appendChild(option);
    });
  }

  // Initialize drag and drop
  initializeDragAndDrop() {
    const columns = document.querySelectorAll('[data-kanban-column]');
    
    columns.forEach(column => {
      new Sortable(column as HTMLElement, {
        group: 'kanban-tasks',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onStart: (evt) => {
          console.log('Drag started:', evt.item.querySelector('h3')?.textContent);
        },
        onEnd: (evt) => {
          const taskId = evt.item.getAttribute('data-task-id');
          const fromColumnId = evt.from.getAttribute('data-kanban-column');
          const toColumnId = evt.to.getAttribute('data-kanban-column');
          
          if (taskId && fromColumnId && toColumnId && fromColumnId !== toColumnId) {
            this.moveTask(taskId, fromColumnId, toColumnId);
            this.updateAllColumnCounts();
          }
        }
      });
    });
    
    console.log('Drag and drop initialized for all columns');
  }

  // Reset to default data
  resetData() {
    this.data = this.getDefaultData();
    this.saveData();
    this.renderProjects();
    this.renderAllTasks();
    this.updateAllColumnCounts();
    this.populateProjectDropdown();
    console.log('Data reset to defaults');
  }

  // Export data as JSON
  exportData() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kanban-board-data.json';
    link.click();
    console.log('Data exported');
  }

  // Import data from JSON
  importData(jsonData: string) {
    try {
      this.data = JSON.parse(jsonData);
      this.saveData();
      this.renderProjects();
      this.renderAllTasks();
      this.updateAllColumnCounts();
      this.populateProjectDropdown();
      console.log('Data imported successfully');
    } catch (e) {
      console.error('Error importing data:', e);
    }
  }
}

// Modal Management Functions
function openNewTaskModal() {
  const modal = document.getElementById('newTaskModal');
  modal?.classList.add('show');
  const taskTitle = document.getElementById('taskTitle') as HTMLInputElement;
  taskTitle?.focus();
}

function closeNewTaskModal() {
  const modal = document.getElementById('newTaskModal');
  modal?.classList.remove('show');
  const form = document.getElementById('newTaskForm') as HTMLFormElement;
  form?.reset();
}

function openNewProjectModal() {
  const modal = document.getElementById('newProjectModal');
  modal?.classList.add('show');
  const projectName = document.getElementById('projectName') as HTMLInputElement;
  projectName?.focus();
}

function closeNewProjectModal() {
  const modal = document.getElementById('newProjectModal');
  modal?.classList.remove('show');
  const form = document.getElementById('newProjectForm') as HTMLFormElement;
  form?.reset();
}

// Form Submission Handlers
function handleNewTaskSubmit(event: Event) {
  event.preventDefault();
  
  const taskTitle = document.getElementById('taskTitle') as HTMLInputElement;
  const taskAssignee = document.getElementById('taskAssignee') as HTMLInputElement;
  const taskProject = document.getElementById('taskProject') as HTMLSelectElement;
  const taskTime = document.getElementById('taskTime') as HTMLInputElement;
  const taskColumn = document.getElementById('taskColumn') as HTMLSelectElement;
  
  const formData = {
    title: taskTitle.value.trim(),
    assignee: taskAssignee.value.trim() || 'Unassigned',
    project: taskProject.value,
    time: taskTime.value.trim(),
  };
  
  const columnId = taskColumn.value;
  
  if (!formData.title) {
    alert('Please enter a task title');
    return;
  }

  // Find project details
  const project = kanban.data.projects.find((p: any) => p.id === formData.project);
  
  const taskData = {
    title: formData.title,
    assignee: formData.assignee,
    project: project ? project.name : 'General',
    projectColor: project ? project.color : 'gray',
    time: formData.time,
    avatar: `https://picsum.photos/20?${Date.now()}`,
    hasApproval: columnId === 'in-review'
  };

  kanban.addTask(columnId, taskData);
  closeNewTaskModal();
}

function handleNewProjectSubmit(event: Event) {
  event.preventDefault();
  
  const projectName = document.getElementById('projectName') as HTMLInputElement;
  const projectColor = document.getElementById('projectColor') as HTMLSelectElement;
  const projectStarred = document.getElementById('projectStarred') as HTMLInputElement;
  
  const projectData = {
    name: projectName.value.trim(),
    color: projectColor.value,
    starred: projectStarred.checked
  };
  
  if (!projectData.name) {
    alert('Please enter a project name');
    return;
  }

  // Check if project already exists
  const exists = kanban.data.projects.some((p: any) => 
    p.name.toLowerCase() === projectData.name.toLowerCase()
  );
  
  if (exists) {
    alert('A project with this name already exists');
    return;
  }

  kanban.addProject(projectData);
  closeNewProjectModal();
}

// Initialize the Kanban board
const kanban = new KanbanBoard();

// Add event listeners for project interactions
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const projectLink = target.closest('[data-project-id]') as HTMLElement;
  if (projectLink) {
    e.preventDefault();
    const projectId = projectLink.getAttribute('data-project-id');
    
    // Check if clicking on star
    if (target.textContent === '★') {
      kanban.toggleProjectStar(projectId!);
    } else {
      console.log(`Selected project: ${projectId}`);
      // You can add project filtering logic here
    }
  }
});

// Add event listeners for modal actions
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const action = target.getAttribute('data-action');
  
  switch (action) {
    case 'open-new-task-modal':
      openNewTaskModal();
      break;
    case 'close-new-task-modal':
      closeNewTaskModal();
      break;
    case 'open-new-project-modal':
      openNewProjectModal();
      break;
    case 'close-new-project-modal':
      closeNewProjectModal();
      break;
    case 'approve-task':
      const taskId = target.getAttribute('data-task-id');
      if (taskId) {
        kanban.approveTask(taskId);
      }
      break;
  }
});

// Add form event listeners
document.getElementById('newTaskForm')?.addEventListener('submit', handleNewTaskSubmit);
document.getElementById('newProjectForm')?.addEventListener('submit', handleNewProjectSubmit);

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('modal-overlay')) {
    if (target.id === 'newTaskModal') {
      closeNewTaskModal();
    } else if (target.id === 'newProjectModal') {
      closeNewProjectModal();
    }
  }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNewTaskModal();
    closeNewProjectModal();
  }
});

// Global helper functions for testing and management
(window as any).kanban = kanban;

// Example usage functions
(window as any).addSampleTask = () => {
  kanban.addTask('up-next', {
    title: 'Sample Task',
    assignee: 'John Doe',
    project: 'Test Project',
    projectColor: 'blue',
    time: '5h',
    avatar: 'https://picsum.photos/20?99'
  });
};

(window as any).resetBoard = () => {
  if (confirm('Are you sure you want to reset the board? This will clear all current data.')) {
    kanban.resetData();
  }
};

(window as any).exportBoard = () => {
  kanban.exportData();
};

(window as any).openNewTaskModal = openNewTaskModal;
(window as any).openNewProjectModal = openNewProjectModal;

console.log('Dynamic Kanban Board loaded! Available commands:');
console.log('- kanban.addTask(columnId, taskData)');
console.log('- kanban.removeTask(taskId)');
console.log('- kanban.addProject(projectData)');
console.log('- kanban.removeProject(projectId)');
console.log('- kanban.resetData()');
console.log('- kanban.exportData()');
console.log('- addSampleTask() - adds a sample task');
console.log('- resetBoard() - resets to default data');
console.log('- exportBoard() - exports current data');
console.log('- openNewTaskModal() - opens new task dialog');
console.log('- openNewProjectModal() - opens new project dialog');