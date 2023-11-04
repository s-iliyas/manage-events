import { StoreType } from "./../types";
import { TodoType, User } from "@/types";
import { create } from "zustand";

const useStore = create<StoreType>((set) => ({
  todos: [],
  setTodos: (todos: TodoType[]) => set(() => ({ todos })),
  userData: { username: "", accessToken: "" },
  setUserData: (userData: User) => set(() => ({ userData })),
}));

export default useStore;
