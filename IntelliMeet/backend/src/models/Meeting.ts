import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  studentId: mongoose.Types.ObjectId;
  lecturerId: mongoose.Types.ObjectId;
  availabilityId: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'uncompleted';
  meetingLink?: string;
  notes?: string;
  clearedByStudent?: boolean;
  clearedByLecturer?: boolean;
  createdAt: Date;
}

const MeetingSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lecturerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  availabilityId: { type: Schema.Types.ObjectId, ref: 'Availability', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'uncompleted'], default: 'pending' },
  meetingLink: { type: String },
  notes: { type: String },
  clearedByStudent: { type: Boolean, default: false },
  clearedByLecturer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
