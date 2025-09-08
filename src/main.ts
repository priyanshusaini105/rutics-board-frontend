import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
        const data = JSON.parse(stored);
        // Ensure archived tasks array exists
        if (!data.archivedTasks) {
          data.archivedTasks = [];
        }
        return data;
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
      archivedTasks: [],
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
              status: 'blocked',
              avatar: 'https://picsum.photos/20?6'
            },
            {
              id: 'task-2',
              title: 'Create page layout for onboarding.',
              assignee: 'Sarah Wilson',
              project: 'Bluejay',
              projectColor: 'blue',
              time: '15h',
              status: 'paused',
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
              status: 'cancelled',
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
              status: 'done',
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
              status: 'done',
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
              status: 'blocked',
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
    article.className = 'task-card mx-2 rounded-lg border border-zinc-800 bg-zinc-800/60 p-3 shadow-sm hover:border-zinc-700 fade-in-up';
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

    // Status badge mapping
    const statusMap: { [key: string]: { class: string; text: string; icon: string } } = {
      'blocked': { class: 'bg-red-900/50 text-red-300 border-red-800/60', text: 'Blocked', icon: 'fas fa-ban' },
      'paused': { class: 'bg-yellow-900/50 text-yellow-300 border-yellow-800/60', text: 'Paused', icon: 'fas fa-pause' },
      'cancelled': { class: 'bg-gray-900/50 text-gray-400 border-gray-800/60', text: 'Cancelled', icon: 'fas fa-times' },
      'done': { class: 'bg-green-900/50 text-green-300 border-green-800/60', text: 'Done', icon: 'fas fa-check' }
    };

    const projectColorClass = colorMap[task.projectColor] || 'bg-gray-700/40 text-gray-300';

    // Create status badge and archive button row
    const statusRow = task.status && statusMap[task.status] ? `
      <div class="mb-2 flex items-center justify-between">
        <span class="inline-flex items-center gap-1 rounded border ${statusMap[task.status].class} px-2 py-0.5 text-[10px] font-medium cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" data-action="toggle-status" data-task-id="${task.id}">
          <i class="${statusMap[task.status].icon} text-xs"></i>
          ${statusMap[task.status].text}
        </span>
        <button data-action="archive-task" data-task-id="${task.id}" class="p-1 hover:bg-red-700/20 hover:text-red-400 rounded transition-all duration-200 flex-shrink-0" title="Archive task">
          <i class="fas fa-archive text-zinc-500 hover:text-red-400 text-sm"></i>
        </button>
      </div>
    ` : `
      <div class="mb-2 flex items-center justify-between">
        <span class="inline-flex items-center gap-1 rounded border bg-zinc-800/60 text-zinc-400 border-zinc-700/60 px-2 py-0.5 text-[10px] font-medium cursor-pointer hover:bg-zinc-700/60 transition-colors flex-shrink-0" data-action="set-status" data-task-id="${task.id}">
          <i class="fas fa-plus text-xs"></i>
          Status
        </span>
        <button data-action="archive-task" data-task-id="${task.id}" class="p-1 hover:bg-red-700/20 hover:text-red-400 rounded transition-all duration-200 flex-shrink-0" title="Archive task">
          <i class="fas fa-archive text-zinc-500 hover:text-red-400 text-sm"></i>
        </button>
      </div>
    `;

    // Create approval button for review tasks
    const approvalButton = task.hasApproval ? `
      <div class="mt-2 flex gap-2">
        <button data-action="approve-task" data-task-id="${task.id}" class="px-2 py-1 text-[12px] rounded bg-emerald-700/40 text-emerald-300 border border-emerald-800/60">
          Approve
        </button>
      </div>
    ` : '';

    // Create time display for non-review tasks
    const timeDisplay = task.time ? `<span class="text-[11px] text-zinc-400 flex-shrink-0">${this.escapeHtml(task.time)}</span>` : '';

    // Truncate long titles with proper word breaking
    const truncatedTitle = this.truncateText(task.title, 80);

    article.innerHTML = `
      ${statusRow}
      <header class="flex items-start justify-between group">
        <h3 class="text-sm font-medium pr-2 break-words-force min-w-0 flex-1" title="${this.escapeHtml(task.title)}">${this.escapeHtml(truncatedTitle)}</h3>
        <div class="flex items-center gap-1 flex-shrink-0">
          ${timeDisplay}
        </div>
      </header>
      ${approvalButton}
      <footer class="mt-2 flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <img class="h-5 w-5 rounded-full flex-shrink-0" src="${task.avatar}" alt="${this.escapeHtml(task.assignee)}">
          <span class="task-assignee text-xs text-zinc-300 truncate" title="${this.escapeHtml(task.assignee)}">${this.escapeHtml(task.assignee)}</span>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <span class="task-project rounded ${projectColorClass} px-2 py-0.5 text-[11px] truncate max-w-24" title="${this.escapeHtml(task.project)}">${this.escapeHtml(task.project)}</span>
        </div>
      </footer>
    `;

    return article;
  }

  // Helper function to truncate text
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Render projects in the sidebar
  renderProjects() {
    const projectList = document.getElementById('project-list');
    const mobileProjectList = document.getElementById('mobile-project-list');
    
    [projectList, mobileProjectList].forEach(list => {
      if (!list) return;
      list.innerHTML = '';
    });

    // Sort projects: starred projects first, then unstarred
    const sortedProjects = [...this.data.projects].sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return 0;
    });

    sortedProjects.forEach((project: any) => {
      const projectHtml = `
        <div class="project-item group flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 text-zinc-300">
          <a class="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" href="#" data-project-id="${project.id}">
            ${project.starred ? '<i class="fas fa-star text-amber-400 text-xs flex-shrink-0"></i>' : ''}
            <span class="project-name truncate text-sm" title="${this.escapeHtml(project.name)}">${this.escapeHtml(project.name)}</span>
          </a>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button class="project-star-btn p-1 hover:bg-zinc-700 rounded" data-project-id="${project.id}" title="${project.starred ? 'Unstar project' : 'Star project'}">
              <i class="fas fa-star text-xs ${project.starred ? 'text-amber-400' : 'text-zinc-500'}"></i>
            </button>
            <button class="project-delete-btn p-1 hover:bg-red-600 rounded" data-project-id="${project.id}" title="Delete project">
              <i class="fas fa-trash text-xs text-zinc-500 hover:text-white"></i>
            </button>
          </div>
        </div>
      `;

      [projectList, mobileProjectList].forEach(list => {
        if (list) {
          const li = document.createElement('li');
          li.innerHTML = projectHtml;
          list.appendChild(li);
        }
      });
    });

    // Add event listeners for star and delete buttons
    document.querySelectorAll('.project-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const projectId = (e.currentTarget as HTMLElement).getAttribute('data-project-id');
        if (projectId) {
          this.toggleProjectStar(projectId);
        }
      });
    });

    document.querySelectorAll('.project-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const projectId = (e.currentTarget as HTMLElement).getAttribute('data-project-id');
        if (projectId) {
          this.deleteProject(projectId);
        }
      });
    });

    console.log('Projects rendered in sidebar');
  }

  // Helper function to escape HTML
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  // Delete project
  deleteProject(projectId: string) {
    const projectIndex = this.data.projects.findIndex((p: any) => p.id === projectId);
    if (projectIndex === -1) return;

    const project = this.data.projects[projectIndex];
    
    // Show confirmation dialog
    const confirmed = confirm(`Are you sure you want to delete the project "${project.name}"?\n\nThis action cannot be undone and will remove the project from all tasks.`);
    
    if (!confirmed) {
      return; // User cancelled
    }

    // Remove project from the projects array
    this.data.projects.splice(projectIndex, 1);

    // Update any tasks that were assigned to this project to have no project
    Object.keys(this.data.columns).forEach(columnId => {
      const column = this.data.columns[columnId];
      column.tasks.forEach((task: any) => {
        if (task.project === project.name) {
          task.project = '';
        }
      });
    });

    // Also update archived tasks if they exist
    if (this.data.archivedTasks) {
      this.data.archivedTasks.forEach((task: any) => {
        if (task.project === project.name) {
          task.project = '';
        }
      });
    }

    this.saveData();
    this.renderProjects();
    this.renderAllTasks(); // Re-render tasks to update project displays
    console.log(`Project "${project.name}" deleted`);
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

  // Update task status
  updateTaskStatus(taskId: string, newStatus: string | null) {
    // Find the task in any column
    let foundTask: any = null;
    let foundColumnId = null;

    Object.keys(this.data.columns).forEach(columnId => {
      const column = this.data.columns[columnId];
      const taskIndex = column.tasks.findIndex((task: any) => task.id === taskId);
      if (taskIndex !== -1) {
        foundTask = column.tasks[taskIndex];
        foundColumnId = columnId;
      }
    });

    if (foundTask && foundColumnId) {
      if (newStatus) {
        foundTask.status = newStatus;
      } else {
        delete foundTask.status;
      }
      
      this.saveData();
      this.renderColumnTasks(foundColumnId);
      console.log(`Task "${foundTask.title}" status updated to: ${newStatus || 'No Status'}`);
    }
  }

  // Get available statuses
  getAvailableStatuses() {
    return [
      { value: '', label: 'No Status', icon: '' },
      { value: 'blocked', label: 'Blocked', icon: 'fas fa-ban' },
      { value: 'paused', label: 'Paused', icon: 'fas fa-pause' },
      { value: 'cancelled', label: 'Cancelled', icon: 'fas fa-times' },
      { value: 'done', label: 'Done', icon: 'fas fa-check' }
    ];
  }

  // Archive task
  archiveTask(taskId: string) {
    // Find the task in any column
    let foundTask: any = null;
    let foundColumnId = null;

    Object.keys(this.data.columns).forEach(columnId => {
      const column = this.data.columns[columnId];
      const taskIndex = column.tasks.findIndex((task: any) => task.id === taskId);
      if (taskIndex !== -1) {
        foundTask = column.tasks[taskIndex];
        foundColumnId = columnId;
      }
    });

    if (foundTask && foundColumnId) {
      // Show confirmation dialog
      const confirmed = confirm(`Are you sure you want to archive "${foundTask.title}"?\n\nThis will move the task to your archive where you can restore it later.`);
      
      if (!confirmed) {
        return; // User cancelled
      }

      // Remove from current column
      const column = this.data.columns[foundColumnId];
      const taskIndex = column.tasks.findIndex((task: any) => task.id === taskId);
      const taskToArchive = column.tasks.splice(taskIndex, 1)[0];
      
      // Add archived timestamp
      taskToArchive.archivedAt = new Date().toISOString();
      taskToArchive.archivedFrom = foundColumnId;
      
      // Ensure archived tasks array exists
      if (!this.data.archivedTasks) {
        this.data.archivedTasks = [];
      }
      
      // Add to archived tasks
      this.data.archivedTasks.push(taskToArchive);
      
      this.saveData();
      this.renderColumnTasks(foundColumnId);
      this.updateAllColumnCounts();
      
      console.log(`Task "${taskToArchive.title}" archived from ${foundColumnId}`);
      
      // Show confirmation
      this.showNotification(`Task "${taskToArchive.title}" has been archived`, 'success');
    }
  }

  // Restore task from archive
  restoreTask(taskId: string, targetColumnId?: string) {
    if (!this.data.archivedTasks) return;

    const taskIndex = this.data.archivedTasks.findIndex((task: any) => task.id === taskId);
    if (taskIndex === -1) return;

    const task = this.data.archivedTasks.splice(taskIndex, 1)[0];
    
    // Remove archive metadata
    const originalColumn = task.archivedFrom || 'up-next';
    delete task.archivedAt;
    delete task.archivedFrom;
    
    // Restore to specified column or original column
    const restoreToColumn = targetColumnId || originalColumn;
    
    if (this.data.columns[restoreToColumn]) {
      this.data.columns[restoreToColumn].tasks.push(task);
      this.saveData();
      this.renderColumnTasks(restoreToColumn);
      this.updateAllColumnCounts();
      
      console.log(`Task "${task.title}" restored to ${restoreToColumn}`);
      this.showNotification(`Task "${task.title}" restored`, 'success');
    }
  }

  // Get archived tasks
  getArchivedTasks() {
    return this.data.archivedTasks || [];
  }

  // Permanently delete archived task
  deleteArchivedTask(taskId: string) {
    if (!this.data.archivedTasks) return;

    const taskIndex = this.data.archivedTasks.findIndex((task: any) => task.id === taskId);
    if (taskIndex !== -1) {
      const deletedTask = this.data.archivedTasks.splice(taskIndex, 1)[0];
      this.saveData();
      console.log(`Task "${deletedTask.title}" permanently deleted`);
      this.showNotification(`Task "${deletedTask.title}" permanently deleted`, 'info');
    }
  }

  // Show notification
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform translate-x-full ${
      type === 'success' ? 'bg-green-600 text-white' :
      type === 'error' ? 'bg-red-600 text-white' :
      'bg-blue-600 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
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

function openArchiveModal() {
  const modal = document.getElementById('archiveModal');
  modal?.classList.add('show');
  renderArchivedTasks();
}

function closeArchiveModal() {
  const modal = document.getElementById('archiveModal');
  modal?.classList.remove('show');
}

function renderArchivedTasks() {
  const container = document.getElementById('archivedTasksList');
  if (!container) return;

  const archivedTasks = kanban.getArchivedTasks();
  
  if (archivedTasks.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-zinc-400">
        <i class="fas fa-archive text-4xl mb-4 opacity-50"></i>
        <p>No archived tasks</p>
      </div>
    `;
    return;
  }

  container.innerHTML = archivedTasks.map((task: any) => {
    const archivedDate = new Date(task.archivedAt).toLocaleDateString();
    const statusBadge = task.status ? `
      <span class="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium ${getStatusBadgeClass(task.status)}">
        <i class="${getStatusIcon(task.status)}"></i> ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </span>
    ` : '';

    return `
      <div class="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <h3 class="font-medium text-zinc-100 mb-1">${task.title}</h3>
            ${statusBadge}
          </div>
          <div class="flex gap-2 ml-4">
            <button data-action="restore-task" data-task-id="${task.id}" class="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              Restore
            </button>
            <button data-action="delete-archived-task" data-task-id="${task.id}" class="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
              Delete
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center text-xs text-zinc-400">
          <div class="flex items-center gap-4">
            <span><i class="fas fa-user"></i> ${task.assignee}</span>
            <span><i class="fas fa-folder"></i> ${task.project}</span>
            ${task.time ? `<span><i class="fas fa-clock"></i> ${task.time}</span>` : ''}
          </div>
          <div>
            <span>Archived ${archivedDate}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getStatusBadgeClass(status: string) {
  const statusMap: { [key: string]: string } = {
    'blocked': 'bg-red-900/50 text-red-300 border-red-800/60',
    'paused': 'bg-yellow-900/50 text-yellow-300 border-yellow-800/60',
    'cancelled': 'bg-gray-900/50 text-gray-400 border-gray-800/60',
    'done': 'bg-green-900/50 text-green-300 border-green-800/60'
  };
  return statusMap[status] || 'bg-zinc-700/40 text-zinc-300';
}

function getStatusIcon(status: string) {
  const iconMap: { [key: string]: string } = {
    'blocked': 'fas fa-ban',
    'paused': 'fas fa-pause',
    'cancelled': 'fas fa-times',
    'done': 'fas fa-check'
  };
  return iconMap[status] || '';
}

// Status Menu Functions
function showStatusMenu(taskId: string, targetElement: HTMLElement) {
  // Remove existing status menus
  const existingMenu = document.querySelector('.status-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  const statuses = kanban.getAvailableStatuses();
  
  // Create status menu
  const menu = document.createElement('div');
  menu.className = 'status-menu absolute z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-1 min-w-[120px]';
  
  statuses.forEach(status => {
    const button = document.createElement('button');
    button.className = 'w-full text-left px-2 py-1.5 text-xs rounded hover:bg-zinc-700 text-zinc-300 flex items-center gap-2';
    button.innerHTML = `
      ${status.icon ? `<i class="${status.icon}"></i>` : ''}
      <span>${status.label}</span>
    `;
    button.addEventListener('click', () => {
      kanban.updateTaskStatus(taskId, status.value || null);
      menu.remove();
    });
    menu.appendChild(button);
  });

  // Position the menu near the target element
  const rect = targetElement.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.bottom + 5}px`;
  
  document.body.appendChild(menu);

  // Close menu when clicking outside
  const closeMenu = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  
  // Add the event listener after a small delay to prevent immediate closure
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 10);
}

// Form Submission Handlers
function handleNewTaskSubmit(event: Event) {
  event.preventDefault();
  
  const taskTitle = document.getElementById('taskTitle') as HTMLInputElement;
  const taskAssignee = document.getElementById('taskAssignee') as HTMLInputElement;
  const taskProject = document.getElementById('taskProject') as HTMLSelectElement;
  const taskTime = document.getElementById('taskTime') as HTMLInputElement;
  const taskColumn = document.getElementById('taskColumn') as HTMLSelectElement;
  const taskStatus = document.getElementById('taskStatus') as HTMLSelectElement;
  
  const formData = {
    title: taskTitle.value.trim(),
    assignee: taskAssignee.value.trim() || 'Unassigned',
    project: taskProject.value,
    time: taskTime.value.trim(),
    status: taskStatus.value || undefined,
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
    status: formData.status,
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
  
  const projectData = {
    name: projectName.value.trim(),
    color: projectColor.value,
    starred: false // New projects are not starred by default
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
    if (target.classList.contains('fa-star')) {
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
    case 'open-archive-modal':
      openArchiveModal();
      break;
    case 'close-archive-modal':
      closeArchiveModal();
      break;
    case 'approve-task':
      const taskId = target.getAttribute('data-task-id');
      if (taskId) {
        kanban.approveTask(taskId);
      }
      break;
    case 'archive-task':
      const archiveTaskId = target.getAttribute('data-task-id');
      if (archiveTaskId) {
        kanban.archiveTask(archiveTaskId);
      }
      break;
    case 'restore-task':
      const restoreTaskId = target.getAttribute('data-task-id');
      if (restoreTaskId) {
        kanban.restoreTask(restoreTaskId);
        renderArchivedTasks(); // Refresh the archive modal
      }
      break;
    case 'delete-archived-task':
      const deleteTaskId = target.getAttribute('data-task-id');
      if (deleteTaskId && confirm('Are you sure you want to permanently delete this task?')) {
        kanban.deleteArchivedTask(deleteTaskId);
        renderArchivedTasks(); // Refresh the archive modal
      }
      break;
    case 'toggle-status':
    case 'set-status':
      const statusTaskId = target.getAttribute('data-task-id');
      if (statusTaskId) {
        showStatusMenu(statusTaskId, target);
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
    } else if (target.id === 'archiveModal') {
      closeArchiveModal();
    }
  }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNewTaskModal();
    closeNewProjectModal();
    closeArchiveModal();
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
(window as any).openArchiveModal = openArchiveModal;

// Initialize mobile menu when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
  initializeMobileMenu();
}

// Add responsive column height management
function handleResponsiveLayout() {
  const columns = document.querySelectorAll('[data-kanban-column]');
  
  function updateColumnHeights() {
    const viewportHeight = window.innerHeight;
    const headerHeight = document.querySelector('main > div')?.getBoundingClientRect().height || 80;
    const availableHeight = viewportHeight - headerHeight - 100; // 100px buffer
    
    columns.forEach(column => {
      const columnElement = column as HTMLElement;
      columnElement.style.maxHeight = `${availableHeight}px`;
    });
  }
  
  updateColumnHeights();
  window.addEventListener('resize', updateColumnHeights);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateColumnHeights, 100);
  });
}

// Initialize responsive layout
handleResponsiveLayout();

// Initialize mobile menu functionality
function initializeMobileMenu() {
  const openBtn = document.getElementById('open-mobile-menu');
  const closeBtn = document.getElementById('close-mobile-menu');
  const overlay = document.getElementById('mobile-sidebar-overlay');
  const sidebar = document.getElementById('mobile-sidebar');

  if (openBtn && closeBtn && overlay && sidebar) {
    openBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
      setTimeout(() => {
        sidebar.classList.remove('-translate-x-full');
      }, 10);
    });

    closeBtn.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeMobileMenu();
      }
    });

    function closeMobileMenu() {
      if (sidebar && overlay) {
        sidebar.classList.add('-translate-x-full');
        setTimeout(() => {
          overlay.classList.add('hidden');
        }, 300);
      }
    }

    // Sync mobile project list with main project list
    const mainProjectList = document.getElementById('project-list');
    const mobileProjectList = document.getElementById('mobile-project-list');
    if (mainProjectList && mobileProjectList) {
      // Copy content from main project list to mobile project list
      const observer = new MutationObserver(() => {
        mobileProjectList.innerHTML = mainProjectList.innerHTML;
      });
      observer.observe(mainProjectList, { childList: true, subtree: true });
      mobileProjectList.innerHTML = mainProjectList.innerHTML;
    }
  }
}

initializeMobileMenu();

console.log('Dynamic Kanban Board loaded! Available commands:');
console.log('- kanban.addTask(columnId, taskData)');
console.log('- kanban.removeTask(taskId)');
console.log('- kanban.archiveTask(taskId) - archive a task');
console.log('- kanban.restoreTask(taskId) - restore archived task');
console.log('- kanban.getArchivedTasks() - get all archived tasks');
console.log('- kanban.addProject(projectData)');
console.log('- kanban.removeProject(projectId)');
console.log('- kanban.resetData()');
console.log('- kanban.exportData()');
console.log('- addSampleTask() - adds a sample task');
console.log('- resetBoard() - resets to default data');
console.log('- exportBoard() - exports current data');
console.log('- openNewTaskModal() - opens new task dialog');
console.log('- openNewProjectModal() - opens new project dialog');
console.log('- openArchiveModal() - opens archive dialog');