// const Resume = require('../models/resume.js');


// // Create a new resume
// exports.createResume = async (req, res, next) => {
//   try {
//     const resume = new Resume(req.body);
//     await resume.save();
//     res.status(201).json(resume);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all resumes
// exports.getResumes = async (req, res, next) => {
//   try {
//     const resumes = await Resume.find();
//     res.json(resumes);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get single resume
// exports.getResumeById = async (req, res, next) => {
//   try {
//     const resume = await Resume.findById(req.params.id);
//     if (!resume) {
//       return res.status(404).json({ message: 'Resume not found' });
//     }
//     res.json(resume);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update resume
// exports.updateResume = async (req, res, next) => {
//   try {
//     const resume = await Resume.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!resume) {
//       return res.status(404).json({ message: 'Resume not found' });
//     }
//     res.json(resume);
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete resume
// exports.deleteResume = async (req, res, next) => {
//   try {
//     const resume = await Resume.findByIdAndDelete(req.params.id);
//     if (!resume) {
//       return res.status(404).json({ message: 'Resume not found' });
//     }
//     res.json({ message: 'Resume deleted' });
//   } catch (error) {
//     next(error);
//   }
// };



import Resume from '../models/Resume.js'; // use import

// Create a new resume
export const createResume = async (req, res, next) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

// Get all resumes
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

// Get single resume
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    next(error);
  }
};

// Update resume
export const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    next(error);
  }
};

// Delete resume
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};
