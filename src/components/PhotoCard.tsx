"use client";

import type { UnsplashPhoto } from "@/types/unsplash";
import { useModalStore } from "@/store/modalStore";

type PhotoCardProps = {
	photo: UnsplashPhoto;
};

export default function PhotoCard({ photo }: PhotoCardProps) {
	const openModal = useModalStore((s) => s.openModal);

	const handleOpen = () => openModal(photo.id);

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleOpen}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") handleOpen();
			}}
			className="group relative block h-64 w-full overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
		>
			<img
				src={photo.urls.small}
				alt={photo.alt_description ?? ""}
				loading="lazy"
				className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
			/>
			<div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				<p className="text-sm font-medium text-white">by {photo.user.name}</p>
			</div>
		</div>
	);
}


