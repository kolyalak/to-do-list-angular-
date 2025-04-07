export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    projectId?: number;
  }
  