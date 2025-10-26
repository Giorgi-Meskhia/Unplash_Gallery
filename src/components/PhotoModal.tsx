"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useModalStore } from "@/store/modalStore";
import { fetchPhotoById } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, MapPin } from "lucide-react";

export default function PhotoModal() {
	const selectedPhotoId = useModalStore((s) => s.selectedPhotoId);
	const closeModal = useModalStore((s) => s.closeModal);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["photo", selectedPhotoId],
		queryFn: () => fetchPhotoById(selectedPhotoId!),
		enabled: !!selectedPhotoId,
	});

	return (
		<Dialog open={!!selectedPhotoId} onOpenChange={(open) => { if (!open) closeModal(); }}>
			<DialogContent className="max-w-6xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Photo Details</DialogTitle>
				</DialogHeader>
				{isLoading && (
					<div className="flex h-[80vh] w-full items-center justify-center">
						<Loader2 className="h-12 w-12 animate-spin text-primary" />
					</div>
				)}
				{isError && (
					<div className="text-destructive">Failed to load photo details.</div>
				)}
				{data && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Image Column */}
						<div className="md:col-span-2">
							<Image
								src={data.urls.regular}
								alt={data.alt_description || "Photo"}
								width={data.width}
								height={data.height}
								className="w-full h-auto object-contain rounded-lg max-h-[85vh]"
								priority={false}
							/>
						</div>

						{/* Details Column */}
						<div className="flex flex-col space-y-4">

							{/* Photographer Info */}
							<a
								href={data.user.links?.html ?? "#"}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center space-x-3 group"
							>
							<Image
								src={data.user.profile_image.medium}
								alt={data.user.name}
								width={48}
								height={48}
								className="w-12 h-12 rounded-full border-2 border-primary"
							/>
								<div>
									<p className="text-lg font-semibold group-hover:underline">{data.user.name}</p>
									<p className="text-sm text-muted-foreground">@{data.user.username}</p>
								</div>
							</a>

							{/* Description */}
							{data.description && (
								<p className="text-base">{data.description}</p>
							)}

							{/* Stats */}
							<div className="space-y-3 pt-4">
								{data.downloads != null && (
									<div className="flex items-center space-x-2 text-muted-foreground">
										<Download className="h-5 w-5" />
										<span>{data.downloads.toLocaleString()} downloads</span>
									</div>
								)}
								{data.location?.name && (
									<div className="flex items-center space-x-2 text-muted-foreground">
										<MapPin className="h-5 w-5" />
										<span>{data.location.name}</span>
									</div>
								)}
							</div>

							{/* Action Button */}
							<Button asChild className="mt-auto">
								<a href={data.links.html} target="_blank" rel="noopener noreferrer">
									View on Unsplash
								</a>
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}


