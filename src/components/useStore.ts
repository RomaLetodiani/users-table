import { create } from 'zustand';
import axios from 'axios';
import { User } from './types';

interface State {
  data: User[];
  fetchData: () => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  addUser: (newUser: User) => Promise<void>;
  updateUserInfo: (userId: number, updatedInfo: Partial<User>) => void;
}
const url = 'https://romaletodiani.github.io/users-table/db.json';

const useStore = create<State>((set) => ({
  data: [], // Initial state

  fetchData: async () => {
    try {
      await axios.get(url).then((response) => set({ data: response.data }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  addUser: async (newUser: User) => {
    // if we would had have a backend, we would call it here
    // await axios.post(url, newUser);
    set((state) => ({
      data: [...state.data, newUser],
    }));
  },
  deleteUser: async (userId: number) => {
    try {
      // if we would had have a backend, we would call it here
      // const user = `${url}/${userId}`;
      // await axios.delete(url);
      set((state) => ({
        data: state.data.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  },
  updateUserInfo: (userId: number, updatedInfo: Partial<User>) => {
    // if we would had have a backend, we would call it here
    // const user = `${url}/${userId}`;
    // await axios.put(user, updatedInfo);
    set((state) => ({
      data: state.data.map((user) =>
        user.id === userId ? { ...user, ...updatedInfo } : user
      ),
    }));
  },
}));

export default useStore;
