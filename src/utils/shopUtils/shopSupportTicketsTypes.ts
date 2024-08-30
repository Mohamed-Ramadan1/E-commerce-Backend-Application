import { Schema } from "mongoose";

// type for the ticket data object
export type TicketObjectData = {
  shop: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subject: string;
  description: string;
  category: string;
  img?: string;
  imgPublicId?: string;
};

// type for the update ticket data object
export type TicketUpdateObjectData = {
  subject?: string;
  description?: string;
  category?: string;
  status?: string;
  img?: string;
  imgPublicId?: string;
};
