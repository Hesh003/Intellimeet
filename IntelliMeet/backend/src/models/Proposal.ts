import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  studentId: mongoose.Types.ObjectId;
  supervisorId?: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  documentUrl?: string;
  manualFeedback: Array<{
    message: string;
    lecturerId: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;
  status: 'submitted' | 'evaluated';
  createdAt: Date;
}

const ProposalSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String },
  documentUrl: { type: String },
  manualFeedback: [{
    message: { type: String, required: true },
    lecturerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['submitted', 'evaluated'], default: 'submitted' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProposal>('Proposal', ProposalSchema);
