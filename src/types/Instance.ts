export type Instance = {
  id: string;
  name: string;
  description: string;
  syncMessages: boolean;
  connectionStatus: string;
  ownerJid: string;
  profilePicUrl: string;
  createdAt: string;
  updatedAt: string;
  Auth: {
    id: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
  };
  Webhook: {
    id: number;
    createdAt: string;
    updatedAt: string;
    url: string;
  } | null;
  Typebot: any;
};
