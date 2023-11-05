export type TodoFormInput = {
  title: string;
  description: string;
  completed?: boolean;
  dueDate: string;
};

export interface TodoType {
  id: number;
  title: string;
  completed: boolean;
  description: string;
  dueDate: string;
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