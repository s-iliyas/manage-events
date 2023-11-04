"use client";

import { TodoType } from "@/types";
import { TodoContext } from "@/contexts/TodoProvider";
import useCustomMessage from "@/hooks/useCustomMessage";

import { Checkbox } from "antd";
import { API, Auth } from "aws-amplify";
import { useContext, useState } from "react";

const TodoItem = ({ todo }: { todo: TodoType }) => {
  const { setTodo, setTodos, todos, setOpenTodoForm, setFormTitle } =
    useContext(TodoContext);

  const { error, contextHolder } = useCustomMessage();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await API.del(
        `${process.env.NEXT_PUBLIC_AWS_API_GATEWAY_API_NAME}`,
        `/dev/todo${todo?.id ? `/${todo.id}` : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          },
        }
      );

      if (res?.id === todo.id) {
        setTodos([...todos.filter((x) => x.id !== todo?.id)]);
      }
    } catch (err: any) {
      error(err?.message || "An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 flex-col flex gap-1 rounded-md w-full p-2">
      {contextHolder}
      <strong>{todo?.title}</strong>
      <small>{todo?.description}</small>
      <div className="flex flex-row gap-2 items-center">
        <small>Completed:</small>
        <Checkbox checked={todo?.completed} disabled />
      </div>
      <div className="flex flex-row gap-2 items-center">
        <small>Due date:</small>
        <small>{todo?.dueDate}</small>
      </div>
      <div className="flex flex-wrap ml-auto gap-2 items-center">
        <button
          onClick={() => {
            setTodo(todo);
            setOpenTodoForm(true);
            setFormTitle("Edit Your Todo");
          }}
          className="py-1 bg-sky-700 text-white max-w-max px-2 rounded-md ml-auto cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="py-1 bg-red-600 text-white max-w-max px-2 rounded-md ml-auto cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
