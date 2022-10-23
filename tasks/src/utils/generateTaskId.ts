import mongoose from 'mongoose';

export const generateTaskId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};
