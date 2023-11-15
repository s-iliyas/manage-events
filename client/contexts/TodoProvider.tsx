"use client";

import { TodoType } from "@/types";
import { createContext, useState } from "react";

interface TodoContextType {
  todos: TodoType[];
  todo: TodoType;
  openTodoForm: boolean;
  formTitle: string;
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  setTodo: React.Dispatch<React.SetStateAction<TodoType>>;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  setOpenTodoForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialTodoState = {
  completed: false,
  title: "",
  description: "",
  dueTime: "",
  id: 0,
};

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  todo: initialTodoState,
  formTitle: "",
  openTodoForm: false,
  setOpenTodoForm: () => {},
  setTodos: () => {},
  setTodo: () => {},
  setFormTitle: () => {},
});

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [todo, setTodo] = useState<TodoType>(initialTodoState);
  const [openTodoForm, setOpenTodoForm] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("");

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        todo,
        setTodo,
        openTodoForm,
        setOpenTodoForm,
        formTitle,
        setFormTitle,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
