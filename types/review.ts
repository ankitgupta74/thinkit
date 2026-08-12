export interface ReviewUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  hasVoted?: boolean;
  helpfulCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}
