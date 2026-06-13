import { useCallback, useEffect, useState } from "react";
import api from "@/src/services/api";
import { message } from "antd";
import { IMenubar } from "@/src/services/menubarService";

interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export function useMenubar() {
    const [menubars, setMenubars] = useState<IMenubar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMenubars = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get<IApiResponse<IMenubar[]>>(`/settings/menubars/get-all`);

            if (response?.data?.success) {
                setMenubars(response.data.data || []);
            } else {
                setMenubars([]);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch menubars");
        } finally {
            setLoading(false);
        }
    }, []);

    const createMenubar = async (payload: object) => {
        try {
            setLoading(true);
            const response = await api.post(`/settings/menubars/create`, payload);

            message.success("Menubar created successfully");
            fetchMenubars();
            return response?.data;
        } catch (err: any) {
            message.error(err?.response?.data?.message || err.message || "Failed to create menubar");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateMenubar = async (id: string, payload: object) => {
        try {
            setLoading(true);
            const response = await api.patch(`/settings/menubars/update/${id}`, payload);

            message.success("Menubar updated successfully");
            fetchMenubars();
            return response?.data;
        } catch (err: any) {
            message.error(err?.response?.data?.message || err.message || "Failed to update menubar");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteMenubar = async (id: string) => {
        try {
            setLoading(true);
            await api.delete(`/settings/menubars/delete/${id}`);

            message.success("Menubar deleted successfully");
            setMenubars(prev => prev.filter(item => item._id !== id));
        } catch (err: any) {
            message.error(err?.response?.data?.message || err.message || "Failed to delete menubar");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenubars();
    }, [fetchMenubars]);

    return {
        menubars,
        loading,
        error,

        // actions
        refetch: fetchMenubars,
        createMenubar,
        updateMenubar,
        deleteMenubar,
    };
}
