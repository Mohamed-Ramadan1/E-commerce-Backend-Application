import Bull from "bull";

export const emailQueue = new Bull("email-queue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

// emailQueue.process(async (job) => {
//   // send email logic here
//   console.log("Sending email to: ", job);
// });

emailQueue.process(async (job) => {
  return console.log("kill all them", job);
});

// Define a local completed event
emailQueue.on("completed", (job, result) => {
  console.log(`Job completed with result ${result}`);
});
