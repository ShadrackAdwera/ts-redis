import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose, { Schema, Model, Document } from 'mongoose';

// handle this using the npm package
export enum userRoles {
  Admin = 'Admin',
  Agent = 'Agent',
  User = 'User',
}

interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
  section: string;
  category: string;
  resetToken?: string;
  tokenExpirationDate?: Date;
  roles: string[];
  version: number;
}

interface UserModel extends Model<UserDoc> {
  username: string;
  email: string;
  password: string;
  section: string;
  category: string;
  resetToken?: string;
  tokenExpirationDate?: Date;
  roles: string[];
}

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    section: { type: String },
    category: { type: Schema.Types.ObjectId },
    resetToken: { type: String },
    tokenExpirationDate: { type: Date },
    roles: [
      { type: String, enum: Object.keys(userRoles), default: userRoles.User },
    ],
  },
  { timestamps: true, toJSON: { getters: true } }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export { User };
