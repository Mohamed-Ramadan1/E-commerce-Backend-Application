import createMailTransporter from "../../config/mailTransporter.config";
import { IUser } from "../../models/user/user.interface";
import { ISupportTicket } from "../../models/supportTickets/supportTickets.interface";

const sendSupportTicketResponseEmail = (
  user: IUser,
  supportTicket: ISupportTicket,
  responseMessage: string
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: `Response to Your Support Ticket [Ticket ID: ${supportTicket._id}]`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
          <h2 style="color: #3498DB; text-align: center;">Hello ${user.name},</h2>
          <p style="font-size: 16px;">Thank you for reaching out to us. We have reviewed your support ticket and are happy to assist you with your inquiry.</p>
          <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; margin-top: 10px;">
            <p style="font-size: 16px;"><strong>Support Ticket Details:</strong></p>
            <ul style="list-style-type: none; padding: 0;">
              <li style="padding: 5px 0;"><strong>Ticket ID:</strong> ${supportTicket._id}</li>
              <li style="padding: 5px 0;"><strong>Submitted On:</strong> ${supportTicket.createdAt}</li>
              <li style="padding: 5px 0;"><strong>Subject:</strong> ${supportTicket.subject}</li>
            </ul>
          </div>
          <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; margin-top: 10px;">
            <p style="font-size: 16px;"><strong>Our Response:</strong></p>
            <p style="font-size: 16px;">${responseMessage}</p>
          </div>
          <p style="font-size: 16px;">If you have any further questions or need additional assistance, please feel free to reply to this email or contact our support team directly.</p>
          <p style="margin-top: 20px; font-size: 16px;">Thank you for your patience and understanding.</p>
          <p style="margin-top: 20px; font-size: 16px;">Best regards,<br><strong>E-commerce Application Team</strong></p>
        </div>
      </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Support ticket response email sent");
    }
  });
};

export default sendSupportTicketResponseEmail;
