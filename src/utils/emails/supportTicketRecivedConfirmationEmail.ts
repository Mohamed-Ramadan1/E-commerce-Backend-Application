import createMailTransporter from "./email";
import { IUser } from "../../models/user.interface";
import { ISupportTicket } from "../../models/supportTickets.interface";

const supportTicketReceivedConfirmationEmail = (
  user: IUser,
  supportTicket: ISupportTicket
) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "E-commerce Application <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Support Ticket Received",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2C3E50;">Hello ${user.name},</h2>
        <p>We have received your support ticket with the following details:</p>
        <ul>
          <li><strong>Ticket ID:</strong> ${supportTicket._id}</li>
          <li><strong>Subject:</strong> ${supportTicket.subject}</li>
          <li><strong>Description:</strong> ${supportTicket.description}</li>
          <li><strong>Status:</strong> ${supportTicket.status}</li>
          <li><strong>Category:</strong> ${supportTicket.category}</li>
        </ul>
        <p>Our support team will review your ticket and get back to you as soon as possible. If you have any additional information or questions, please feel free to reply to this email.</p>
        <p style="margin-top: 20px;">Best regards,<br>E-commerce Application Team</p>
      </div>
    `,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Support ticket confirmation email sent");
    }
  });
};

export default supportTicketReceivedConfirmationEmail;
