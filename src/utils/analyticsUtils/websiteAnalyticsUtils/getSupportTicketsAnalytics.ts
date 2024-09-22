import ShopSupportTicket from "../../../models/supportTickets/shopSupportTicketModal";
import SupportTicket from "../../../models/supportTickets/supportTicketsModel";
import { TicketStatus } from "../../../models/supportTickets/supportTickets.interface";
import { SupportTicketStatus } from "../../../models/supportTickets/shopSupportTicket.interface";

interface SupportTicketAnalytics {
  totalUsersSupportTickets: number;
  totalProcessedSupportTickets: number;
  newUserSupportTickets: number;
  totalShopSupportTickets: number;
  totalProcessedShopSupportTickets: number;
  newShopSupportTickets: number;
}

export async function calculateSupportTicketAnalytics(): Promise<SupportTicketAnalytics> {
  const [userTickets, shopTickets] = await Promise.all([
    SupportTicket.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          processed: [
            { $match: { status: TicketStatus.Closed } },
            { $count: "count" },
          ],
          new: [{ $match: { status: TicketStatus.Open } }, { $count: "count" }],
        },
      },
    ]),
    ShopSupportTicket.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          processed: [
            { $match: { status: SupportTicketStatus.Closed } },
            { $count: "count" },
          ],
          new: [
            { $match: { status: SupportTicketStatus.Open } },
            { $count: "count" },
          ],
        },
      },
    ]),
  ]);

  // Function to safely extract the count from the aggregate result
  const getCount = (result: any[], key: string) =>
    result[0]?.[key]?.[0]?.count ?? 0;

  // Returning the formatted analytics object
  return {
    totalUsersSupportTickets: getCount(userTickets, "total"),
    totalProcessedSupportTickets: getCount(userTickets, "processed"),
    newUserSupportTickets: getCount(userTickets, "new"),
    totalShopSupportTickets: getCount(shopTickets, "total"),
    totalProcessedShopSupportTickets: getCount(shopTickets, "processed"),
    newShopSupportTickets: getCount(shopTickets, "new"),
  };
}
