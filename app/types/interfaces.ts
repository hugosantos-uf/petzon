export interface MultiActionAreaCardProps {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  detailLink: string; // Nova prop
}

export interface LikeStateProps {
  likes: Record<string, boolean>;
}
