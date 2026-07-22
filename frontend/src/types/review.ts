export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}
