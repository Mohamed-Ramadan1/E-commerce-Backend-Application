import createMailTransporter from "./email";
import { IUser } from "../models/user.interface.js";

const sendVerificationMail = (user: IUser) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: "Learning website <azaz123456az4@gmail.com>",
    to: user.email,
    subject: "Verify your email",
    html: `<p>Hello ${user.name}, Verify your email by clicking this link:
     <a href="http://127.0.0.1:3000/api/v1/auth/verify-email/">
       Verify your email
     </a>
   </p>`,
  };
  transport.sendMail(mailOptions, (err: Error | null, info: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("verification email sent");
    }
  });
};

export default sendVerificationMail;
