import { create } from "zustand";

type ModalStoreState = {
	selectedPhotoId: string | null;
	openModal: (id: string) => void;
	closeModal: () => void;
};

export const useModalStore = create<ModalStoreState>((set) => ({
	selectedPhotoId: null,
	openModal: (id: string) => set({ selectedPhotoId: id }),
	closeModal: () => set({ selectedPhotoId: null }),
}));


