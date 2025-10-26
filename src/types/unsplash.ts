export interface UnsplashUser {
	name: string;
	username: string;
	profile_image: {
		medium: string;
	};
	links?: {
		html: string;
	};
}

export interface UnsplashPhoto {
	id: string;
	created_at: string;
	width: number;
	height: number;
	description: string | null;
	alt_description: string | null;
	urls: {
		raw: string;
		full: string;
		regular: string;
		small: string;
		thumb: string;
	};
	links: {
		html: string;
	};
	user: UnsplashUser;
	downloads?: number; // Available on detail endpoint
	location?: {
		// Available on detail endpoint
		name: string | null;
	};
}

export interface UnsplashSearchResponse {
	total: number;
	total_pages: number;
	results: UnsplashPhoto[];
}


