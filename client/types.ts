export type TodoFormInput = {
  title: string;
  description: string;
  completed?: boolean;
  dueTime?: string;
};

export interface TodoType {
  dueTime: string;
  id: number;
  title: string;
  completed: boolean;
  description: string;
}

export interface User {
  username: string;
}

export interface StoreType {
  todos: TodoType[];
  setTodos: (todos: TodoType[]) => void;
  userData: User; 
  setUserData: (user: User) => void;
}