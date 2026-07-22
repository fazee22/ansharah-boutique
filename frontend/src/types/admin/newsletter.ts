export interface NewsletterSubscriber {
  id: number;
  email: string;
  source: string | null;
  subscribedAt: string;
}
