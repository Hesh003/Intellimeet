import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailability extends Document {
  lecturerId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked';
  allowedBatches: string[];
  maxStudents: number;
  createdAt: Date;
}

const AvailabilitySchema: Schema = new Schema({
  lecturerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
  maxStudents: { type: Number, default: 1 },
  allowedBatches: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAvailability>('Availability', AvailabilitySchema);
