import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {}

  getTasks() {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task) {
    this.tasks.push({ ...task, id: this.tasks.length + 1 });
    this.tasksSubject.next(this.tasks);
  }

  updateTask(updatedTask: Task) {
    this.tasks = this.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
    this.tasksSubject.next(this.tasks);
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next(this.tasks);
  }
}
