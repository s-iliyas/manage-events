import React from "react";
import TodoItem from "./todoItem";
import Heading from "@/components/ui/heading";
import { TodoType } from "@/types";
import TodoForm from "../todoForm";

const TodoList = ({
  todos,
  setOpenTodoForm,
  setFormTitle,
  setTodo,
}: {
  todos: TodoType[];
  setOpenTodoForm: any;
  setFormTitle: any;
  setTodo: any;
}) => {
  return (
    <section className="flex flex-col md:w-[70%] w-full justify-center items-center gap-4">
      <br />
      <Heading title="Manage Your Todo List" />
      <button
        onClick={() => {
          setTodo({});
          setOpenTodoForm(true);
          setFormTitle("Create Todo");
        }}
        className="py-1 bg-gray-700 text-white max-w-max px-2 rounded-md cursor-pointer"
      >
        Create Todo
      </button>
      {todos?.length > 0 ? (
        <>
          {[...todos]?.reverse()?.map((todo) => (
            <TodoItem key={todo?.id} todo={todo} />
          ))}
        </>
      ) : (
        <p>No todos have been created.</p>
      )}
      <TodoForm />
    </section>
  );
};

export default TodoList;
