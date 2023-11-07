"use client";

import * as yup from "yup";
import { Checkbox, Input, Modal } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Heading from "../ui/heading";
import { TodoFormInput } from "@/types";
import { TodoContext } from "@/contexts/TodoProvider";
import useCustomMessage from "@/hooks/useCustomMessage";
import editTodoApi from "@/utils/editTodoApi";
import addTodoApi from "@/utils/addTodoApi";

// Using custom test method
function isValidDueDate(value: any): any {
  if (!value) {
    return false;
  }

  const [date, month, year] = value?.split("-");
  if (
    !(Number(date) <= 31) ||
    !(Number(month) <= 12) ||
    !(year?.length === 4 && !Number.isNaN(Number(year)))
  ) {
    return false;
  }
  return true;
}

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
    completed: yup.boolean(),
    dueDate: yup.string().required(),
  })
  .required();

const TodoForm = () => {
  const { setTodos, openTodoForm, formTitle, setOpenTodoForm, todos, todo } =
    useContext(TodoContext);

  const [loading, setLoading] = useState(false);

  const { error, contextHolder } = useCustomMessage();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      completed: todo?.completed || false,
      title: todo?.title || "",
      description: todo?.description || "",
      dueDate: todo?.dueDate || "",
    },
  });

  useEffect(() => {
    if (todo) {
      // Set default values using the todo object once it is available
      setValue("completed", todo.completed || false);
      setValue("title", todo.title || "");
      setValue("description", todo.description || "");
      setValue("dueDate", todo.dueDate || "");
    }
  }, [todo, setValue]);

  const onSubmit: SubmitHandler<TodoFormInput> = async (data) => {
    const isValidDate = isValidDueDate(data.dueDate);
    if (!isValidDate) {
      error("Invalid Date! Format should be 'dd-mm-yyyy'");
      return;
    }

    setLoading(true);
    try {
      const res = todo?.id
        ? await editTodoApi(data, todo?.id)
        : await addTodoApi(data);
      setTodos([...todos?.filter((x) => x.id !== todo?.id), res]);
    } catch (err: any) {
      error(err?.message || "An error occurred while processing your request.");
    } finally {
      setLoading(false);
      setOpenTodoForm(false);
    }
  };

  return (
    <Modal
      mask={false}
      title={<Heading title={formTitle} />}
      closable={false}
      centered
      open={openTodoForm}
      onCancel={() => {
        setOpenTodoForm(false);
      }}
      width={400}
      footer={[<button key={"cancel"}></button>]}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2 "
      >
        {contextHolder}
        <div className="flex flex-col">
          <small>Title:</small>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input placeholder="Client Meet" {...field} />
            )}
          />
          <small className="text-red-600">{errors.title?.message}</small>
        </div>
        <div className="flex flex-col">
          <small>Description:</small>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                rows={6}
                {...field}
                placeholder="Gotta meet my client in Kerala for ...."
              />
            )}
          />
          <small className="text-red-600">{errors.description?.message}</small>
        </div>
        <div className="flex flex-col">
          <small>Due date:</small>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="dd-mm-yyyy" />
            )}
          />
          <small className="text-red-600">{errors.dueDate?.message}</small>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-2">
            <small>Completed:</small>
            <Controller
              name="completed"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} />
              )}
            />
          </div>
          <small className="text-red-600">{errors.completed?.message}</small>
        </div>
        <div className="flex flex-wrap ml-auto gap-2">
          <button
            type="button"
            onClick={() => {
              setOpenTodoForm(false);
            }}
            className="py-1 border border-gray-700 max-w-max px-2 rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <input
            type="submit"
            disabled={loading}
            className="py-1 bg-gray-700 text-white max-w-max px-2 rounded-md cursor-pointer"
          />
        </div>
      </form>
    </Modal>
  );
};

export default TodoForm;
