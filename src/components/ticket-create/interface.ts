import type { FormInstance, UploadFile } from 'antd';

// Data sub-interfaces for clarity & API mapping
export interface IOrganizerData {
    name: string;
    contactNumber: string;
    address: string;
    description?: string;
    photo?: UploadFile[];
}

export interface IPerformerData {
    name: string;
    contactNumber: string;
    address: string;
    passion: string;
    bio: string;
    description?: string;
    profilePhoto?: UploadFile[];
}

export interface IEventCategory {
    _id: string;
    name: string;
}

// Strong definitions for the component props
export interface IEventModalProps {
    editingId: string | null | undefined;
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    form: FormInstance;
    onFinish: (values: any) => void;
    categories: IEventCategory[];
    normFile: (e: any) => any;
    isPremium: boolean;
    isLoading: boolean;
}