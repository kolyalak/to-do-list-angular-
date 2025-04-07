import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  name: string;
  description: string;
  tags: string[];
  priority: number;
  date: string;
  project?: string;
}

interface Project {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  tasks: Task[] = [];
  projects: Project[] = [];
  newTask: Partial<Task> = { name: '', description: '', tags: [], priority: 1, date: '', project: '' };
  newProjectName: string = '';
  filterText: string = '';
  filterPriority: number | null = null;
  filterDate: 'day' | 'week' | 'month' | '' = '';
  editingTask: Task | null = null;

  addTask(taskForm: any) {
    if (taskForm.valid) {
      const task: Task = {
        name: this.newTask.name || '',
        description: this.newTask.description || '',
        tags: Array.isArray(this.newTask.tags)
          ? this.newTask.tags
          : (this.newTask.tags as unknown as string).split(',').map(tag => tag.trim()), priority: Number(this.newTask.priority),
        date: this.newTask.date || '',
        project: this.newTask.project || ''
      };

      if (this.editingTask) {
        Object.assign(this.editingTask, task);
        this.editingTask = null;
      } else {
        this.tasks = [...this.tasks, task];
      }

      this.newTask = { name: '', description: '', tags: [], priority: 1, date: '', project: '' };
    }
  }

  editTask(task: Task) {
    this.newTask = { ...task, tags: [...task.tags] };
    this.editingTask = task;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }

  addProject() {
    if (this.newProjectName.trim()) {
      this.projects.push({ name: this.newProjectName, tasks: [] });
      this.newProjectName = '';
    }
  }

  addToProject(task: Task, projectName: string) {
    const project = this.projects.find(p => p.name === projectName);
    if (project) {
      if (!task.project) {
        task.project = projectName;
        project.tasks.push(task);
      }
    }
  }

  filterTasks(): Task[] {
    const now = new Date();

    return this.tasks.filter(task => {
      const taskDate = new Date(task.date);
      const isToday = taskDate.toDateString() === now.toDateString();
      const isThisWeek = (taskDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      const isThisMonth = now.getMonth() === taskDate.getMonth() && now.getFullYear() === taskDate.getFullYear();

      return (
        (!this.filterText || task.name.toLowerCase().includes(this.filterText.toLowerCase()) || task.description.toLowerCase().includes(this.filterText.toLowerCase())) &&
        (!this.filterPriority || task.priority === this.filterPriority) &&
        (this.filterDate === '' ||
          (this.filterDate === 'day' && isToday) ||
          (this.filterDate === 'week' && isThisWeek) ||
          (this.filterDate === 'month' && isThisMonth))
      );
    });
  }
}
