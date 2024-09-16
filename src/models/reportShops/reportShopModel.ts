import { Schema, Model, model } from "mongoose";

import { IReportShop, ReportStatus } from "./reportShop.interface";

const reportShopSchema = new Schema<IReportShop>(
  {
    reportedShop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    resolvedByComments: { type: String },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
    },
  },
  { timestamps: true }
);

reportShopSchema.index({ reportedShop: 1, status: 1 });
reportShopSchema.index({ reportedBy: 1, status: 1 });
reportShopSchema.index({ processedBy: 1, status: 1 });

reportShopSchema.pre<IReportShop>(/^find/, function (next) {
  this.populate("reportedShop");
  this.populate("reportedBy");

  this.populate("resolvedBy");

  next();
});

const ReportShop: Model<IReportShop> = model("ReportShop", reportShopSchema);

export default ReportShop;
