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

  const [loading, setLoading] = React.useState(true);

  const { error, contextHolder } = useCustomMessage();

  const { setTodo, todos, setTodos, setOpenTodoForm, setFormTitle } =
    useContext(TodoContext);

  const getTodos = async (token: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`,
        {
          query: `
            query getTodos {
              todos {
                completed
                description
                dueTime
                id
                title
              }
            }  
        `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(res.data?.data?.todos);
      setLoading(false);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const validateSession = async () => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();      
      if (token) {
        setUserData({
          username: user?.username,
        });
        getTodos(token);
      } else {
        push("/login");
      }
    } catch (err: any) {
      setTimeout(() => {
        error(err?.message);
        push("/login");
      }, 2000);
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
