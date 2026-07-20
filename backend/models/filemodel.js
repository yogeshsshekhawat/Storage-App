import { model, Schema } from "mongoose";
import { type } from "node:os";
import { stringify } from "node:querystring";

const fileschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentid: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userid: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ext: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    favorites: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedExpiresAt: {
      type: Date,
      default: null,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      default: null,
    },
    sharedWith: {
      type: [
        {
          email: String,
          permission: {
            type: String,
            enum: ["view", "edit"],
            default: "view",
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const file = model("file", fileschema);

export default file;
