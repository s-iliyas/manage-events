"use client";

import axios from "axios";
import { Auth } from "aws-amplify";
import React, { useContext } from "react";

import useStore from "@/store";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/loader";
import { TodoContext } from "@/contexts/TodoProvider";
import TodoList from "@/components/home/todo/todoList";
import useCustomMessage from "@/hooks/useCustomMessage";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useAuth();
  const { push } = useRouter();

  const { setUserData } = useStore((store) => ({
    setUserData: store.setUserData,
  }));

  const [loading, setLoading] = React.useState(false);

  const { error, contextHolder } = useCustomMessage();

  const { setTodo, todos, setTodos, setOpenTodoForm, setFormTitle } =
    useContext(TodoContext);

  const getTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`,
        {
          query: `
            query getTodos {
              todos {
                completed
                description
                dueDate
                id
                title
              }
            }  
        `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret":
              process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
          },
        }
      );
      setTodos(res.data?.data?.todos);
    } catch (err: any) {
      error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const validateSession = async () => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      !token && push("/login");
    } catch (err) {
      setTimeout(() => {
        push("/login");
      }, 2000);
    }
    try {
      setUserData({
        username: user?.username,
      });
      getTodos();
    } catch (err: any) {
      error(err?.message);
    }
  };

  React.useEffect(() => {
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 min-h-[40rem]">
      {contextHolder}
      {loading ? (
        <Loader />
      ) : (
        <TodoList
          todos={todos}
          setOpenTodoForm={setOpenTodoForm}
          setFormTitle={setFormTitle}
          setTodo={setTodo}
        />
      )}
    </div>
  );
}
