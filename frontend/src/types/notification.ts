export interface Notification {
  id: string;
  type: "order" | "seller" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
