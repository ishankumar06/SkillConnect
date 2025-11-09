import mongoose from 'mongoose';
const resumeSchema = new mongoose.Schema({
  basicInfo: {
    name: String,
    email: String,
    phone: String,
  },
  experience: [
    {
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      startDate: String,
      endDate: String,
    },
  ],
  skills: [String],
  customFields: [
    {
      title: String,
      content: String,
    },
  ],
}, { timestamps: true });



const Resume = mongoose.model('Resume', resumeSchema);


export default Resume;