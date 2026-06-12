import api from "./api";

export interface IBanner {
  _id?: string;
  title: string;
  description?: string;
  category: string;
  coverImage: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const bannerService = {
  getAllBanners: async () => {
    const response = await api.get("/settings/banners/get-all");
    return response.data;
  },

  createBanner: async (data: Partial<IBanner>) => {
    const response = await api.post("/settings/banners/create", data);
    return response.data;
  },

  updateBanner: async (id: string, data: Partial<IBanner>) => {
    const response = await api.patch(`/settings/banners/update/${id}`, data);
    return response.data;
  },

  deleteBanner: async (id: string) => {
    const response = await api.delete(`/settings/banners/delete/${id}`);
    return response.data;
  },
};
