import { HomepageContent } from '../models/HomepageContent.js';
import { AboutContent } from '../models/AboutContent.js';
import { OurSpaceContent } from '../models/OurSpaceContent.js';

// Homepage CMS
export const getHomepageContent = async (req, res, next) => {
  try {
    let content = await HomepageContent.findOne({});
    if (!content) {
      content = await HomepageContent.create({});
    }
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageContent = async (req, res, next) => {
  try {
    let content = await HomepageContent.findOne({});
    let updated;
    if (!content) {
      updated = await HomepageContent.create(req.body);
    } else {
      const id = content._id || content.id;
      updated = await HomepageContent.findByIdAndUpdate(id, req.body, { new: true });
    }
    res.json({
      success: true,
      message: 'Homepage content updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// About CMS
export const getAboutContent = async (req, res, next) => {
  try {
    let content = await AboutContent.findOne({});
    if (!content) {
      content = await AboutContent.create({});
    }
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const updateAboutContent = async (req, res, next) => {
  try {
    let content = await AboutContent.findOne({});
    let updated;
    if (!content) {
      updated = await AboutContent.create(req.body);
    } else {
      const id = content._id || content.id;
      updated = await AboutContent.findByIdAndUpdate(id, req.body, { new: true });
    }
    res.json({
      success: true,
      message: 'About page content updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Our Space CMS
export const getOurSpaceContent = async (req, res, next) => {
  try {
    let content = await OurSpaceContent.findOne({});
    if (!content) {
      content = await OurSpaceContent.create({});
    }
    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const updateOurSpaceContent = async (req, res, next) => {
  try {
    let content = await OurSpaceContent.findOne({});
    let updated;
    if (!content) {
      updated = await OurSpaceContent.create(req.body);
    } else {
      const id = content._id || content.id;
      updated = await OurSpaceContent.findByIdAndUpdate(id, req.body, { new: true });
    }
    res.json({
      success: true,
      message: 'Our Space content updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
