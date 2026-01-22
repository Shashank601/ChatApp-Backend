import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } //for preview
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;


