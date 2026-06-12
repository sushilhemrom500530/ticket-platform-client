import api from "./api";

export interface IMenubar {
  _id?: string;
  label: string;
  href: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const menubarService = {
  getAllMenubars: async () => {
    const response = await api.get("/settings/menubars/get-all");
    return response.data;
  },

  createMenubar: async (data: Partial<IMenubar>) => {
    const response = await api.post("/settings/menubars/create", data);
    return response.data;
  },

  updateMenubar: async (id: string, data: Partial<IMenubar>) => {
    const response = await api.patch(`/settings/menubars/update/${id}`, data);
    return response.data;
  },

  deleteMenubar: async (id: string) => {
    const response = await api.delete(`/settings/menubars/delete/${id}`);
    return response.data;
  },
};
