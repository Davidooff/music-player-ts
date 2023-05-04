import mongoose, { Model, Schema } from "mongoose";
import { platform } from "../../../config/types";

export interface QueueEl {
  link: string;
  platform: string;
  originalName: string;
  _id?: string;
}

interface IQueue {
  _id: string;
  queue: [QueueEl];
}

// Put all user instance methods in this interface:
interface IQueueMethods {
  addToQueue(
    originalName: string,
    platform: string,
    link: string
  ): Promise<boolean>;
  removeFromQueue(id: string): Promise<boolean>;
  getFirstAndDelete(): Promise<{ next?: QueueEl; success: boolean }>;
  getQueue(
    start: number | undefined,
    end: number | undefined
  ): Promise<[QueueEl]>;
}

// Create a new Model type that knows about IUserMethods...
type QueueModel = Model<IQueue, {}, IQueueMethods>;

const queueSchema = new Schema<IQueue, QueueModel, IQueueMethods>({
  _id: String,
  queue: [
    {
      link: String,
      platform: String,
      originalName: String,
    },
  ],
});

queueSchema.method(
  "addToQueue",
  async function (originalName: string, platform: platform, link: string) {
    try {
      const queue = this.queue;
      queue.push({ originalName, platform, link });
      this.queue = queue;
      await this.save();
      return true;
    } catch {
      return false;
    }
  }
);

queueSchema.method("removeFromQueue", async function (id: string) {
  try {
    await this.updateOne({
      $pull: {
        queue: {
          _id: id,
        },
      },
    });
    return true;
  } catch {
    return false;
  }
});

queueSchema.method("getFirstAndDelete", async function () {
  try {
    const queue: any = this.queue;
    const next = queue.shift();
    this.queue = queue;
    await this.save();
    return { next, success: true };
  } catch {
    return { success: false };
  }
});

queueSchema.method("getQueue", async function (start, end) {
  if (typeof start === "number" && typeof end === "number") {
    return await this.queue.slice(start, end);
  }
  return await this.queue;
});

export const queue = mongoose.model("queue", queueSchema);
