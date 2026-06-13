import { useCallback, useEffect, useState } from "react";
import api from "@/src/services/api";
import { message } from "antd";
import { IBanner } from "@/src/services/bannerService";

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useBanner() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<IApiResponse<IBanner[]>>(`/settings/banners/get-all`);
      
      if (response?.data?.success) {
        setBanners(response.data.data || []);
      } else {
        setBanners([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBanner = async (payload: FormData | object) => {
    try {
      setLoading(true);
      const response = await api.post(`/settings/banners/create`, payload);
      
      message.success("Banner created successfully");
      fetchBanners();
      return response?.data;
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Failed to create banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (id: string, payload: FormData | object) => {
    try {
      setLoading(true);
      const response = await api.patch(`/settings/banners/update/${id}`, payload);
      
      message.success("Banner updated successfully");
      fetchBanners();
      return response?.data;
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Failed to update banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/settings/banners/delete/${id}`);
      
      message.success("Banner deleted successfully");
      setBanners(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Failed to delete banner");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    loading,
    error,
    
    // actions
    refetch: fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
  };
}
