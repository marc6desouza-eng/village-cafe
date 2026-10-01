import { OpeningHours } from '../models/OpeningHours.js';
import { ContactSettings } from '../models/ContactSettings.js';
import { SiteSettings } from '../models/SiteSettings.js';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const calculateOpenStatus = (schedule) => {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return { isOpenNow: false, statusText: 'Hours unavailable' };
  }

  // Use current local time
  const now = new Date();
  const currentDayName = dayNames[now.getDay()];
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  const todaySchedule = schedule.find(
    s => s.day?.toLowerCase() === currentDayName.toLowerCase()
  );

  if (!todaySchedule || !todaySchedule.isOpen) {
    return {
      isOpenNow: false,
      statusText: 'Closed Today',
      currentDay: currentDayName,
      currentTime: currentTimeStr,
    };
  }

  const { openTime, closeTime } = todaySchedule;

  if (currentTimeStr >= openTime && currentTimeStr < closeTime) {
    return {
      isOpenNow: true,
      statusText: `Open Now • Closes at ${formatTime12(closeTime)}`,
      currentDay: currentDayName,
      currentTime: currentTimeStr,
      todaySchedule,
    };
  } else if (currentTimeStr < openTime) {
    return {
      isOpenNow: false,
      statusText: `Closed Now • Opens at ${formatTime12(openTime)}`,
      currentDay: currentDayName,
      currentTime: currentTimeStr,
      todaySchedule,
    };
  } else {
    return {
      isOpenNow: false,
      statusText: `Closed for the day • Opens tomorrow`,
      currentDay: currentDayName,
      currentTime: currentTimeStr,
      todaySchedule,
    };
  }
};

const formatTime12 = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${displayHours}:${String(m).padStart(2, '0')} ${period}`;
};

// Opening Hours
export const getOpeningHours = async (req, res, next) => {
  try {
    let hours = await OpeningHours.findOne({});
    if (!hours) {
      hours = await OpeningHours.create({});
    }
    const status = calculateOpenStatus(hours.schedule);
    res.json({
      success: true,
      data: {
        ...hours,
        openStatus: status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOpeningHours = async (req, res, next) => {
  try {
    let hours = await OpeningHours.findOne({});
    let updated;
    if (!hours) {
      updated = await OpeningHours.create(req.body);
    } else {
      const id = hours._id || hours.id;
      updated = await OpeningHours.findByIdAndUpdate(id, req.body, { new: true });
    }
    const status = calculateOpenStatus(updated.schedule);
    res.json({
      success: true,
      message: 'Opening hours updated successfully.',
      data: {
        ...updated,
        openStatus: status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Contact Settings
export const getContactSettings = async (req, res, next) => {
  try {
    let contact = await ContactSettings.findOne({});
    if (!contact) {
      contact = await ContactSettings.create({});
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

export const updateContactSettings = async (req, res, next) => {
  try {
    let contact = await ContactSettings.findOne({});
    let updated;
    if (!contact) {
      updated = await ContactSettings.create(req.body);
    } else {
      const id = contact._id || contact.id;
      updated = await ContactSettings.findByIdAndUpdate(id, req.body, { new: true });
    }
    res.json({
      success: true,
      message: 'Contact information updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Site Settings
export const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({});
    let updated;
    if (!settings) {
      updated = await SiteSettings.create(req.body);
    } else {
      const id = settings._id || settings.id;
      updated = await SiteSettings.findByIdAndUpdate(id, req.body, { new: true });
    }
    res.json({
      success: true,
      message: 'Site settings updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Aggregated Public Bootstrap Data
export const getPublicBootstrap = async (req, res, next) => {
  try {
    let hours = await OpeningHours.findOne({});
    if (!hours) hours = await OpeningHours.create({});

    let contact = await ContactSettings.findOne({});
    if (!contact) contact = await ContactSettings.create({});

    let settings = await SiteSettings.findOne({});
    if (!settings) settings = await SiteSettings.create({});

    const openStatus = calculateOpenStatus(hours.schedule);

    res.json({
      success: true,
      data: {
        hours: { ...hours, openStatus },
        contact,
        settings,
      },
    });
  } catch (error) {
    next(error);
  }
};
