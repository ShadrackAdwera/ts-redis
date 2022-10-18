import { Schema, Document, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export enum taskStatus {
  pending = 'Pending',
  complete = 'Complete',
  cancelled = 'Cancelled',
}

interface TasksDoc extends Document {
  title: string;
  description: string;
  image: string;
  status: string;
  createdBy: string;
  version: number;
}

interface TaskModel extends Model<TasksDoc> {
  title: string;
  description: string;
  image: string;
  status: string;
  createdBy: string;
}

const tasksModel = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    status: {
      type: String,
      required: true,
      enum: Object.values(taskStatus),
      default: taskStatus.pending,
    },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

tasksModel.set('versionKey', 'version');
tasksModel.plugin(updateIfCurrentPlugin);

const Task = model<TasksDoc, TaskModel>('task', tasksModel);

export { Task };
