import Provider from "../models/providerModel.js";
import Notification from '../models/notificationModel.js';
import { sendPushToUser } from './notificationController.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// Register provider (multipart/form-data if file)
export const registerProvider = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      profession,
      title,
      experience,
      bio,
      profile, // now expects the Cloudinary URL
    } = req.body;

    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "Profile photo required." });
    }

    const existing = await Provider.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = await Provider.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      profession,
      title,
      experience,
      bio,
      profileImageUrl: profile, // store Cloudinary URL using correct field name
    });

    res.status(201).json({
      success: true,
      message: "Provider registered successfully!",
      provider: newProvider,
    });
  } catch (error) {
    console.error("RegisterProvider Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
  
};

// Provider login
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message: "Email and password required" });

    const provider = await Provider.findOne({ email });
    if (!provider) return res.status(401).json({ success:false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, provider.password);
    if (!match) return res.status(401).json({ success:false, message: "Invalid credentials" });

    const token = createToken(provider._id);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7*24*60*60*1000
    });

    // if account pending -> still allow login but return status? We will return provider data & status; frontend decides
    const safeProvider = await Provider.findById(provider._id).select("-password");

    res.json({ success:true, provider: safeProvider, token });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Get own provider data
export const getProviderProfile = async (req, res) => {
  try {
    const provider = req.provider;
    res.json({ success:true, provider });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Admin: list providers (optionally filter)
export const listProviders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status; // e.g. ?status=pending
    const providers = await Provider.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success:true, providers });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Admin: Get pending providers for approval
export const getPendingProviders = async (req, res) => {
  try {
    const pendingProviders = await Provider.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: pendingProviders });
  } catch (err) {
    console.error('getPendingProviders', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: approve provider
export const approveProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);
    if (!provider) return res.status(404).json({ success:false, message: "Provider not found" });

    provider.status = "approved";
    await provider.save();

    // TODO: send approval email to provider (optional)

    res.json({ success:true, message: "Provider approved", provider });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Admin: reject (optionally delete)
export const rejectProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);
    if (!provider) return res.status(404).json({ success:false, message: "Provider not found" });

    // mark as rejected (or delete)
    provider.status = "rejected";
    await provider.save();

    // optional: await Provider.findByIdAndDelete(id);

    res.json({ success:true, message: "Provider rejected", provider });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

// Update profile (provider)
// Update profile (provider)
// Update profile (provider)
// Update profile (provider)
export const updateProfile = async (req, res) => {
  try {
    const provider = req.provider;
    const updates = req.body || {};

    // if frontend sends a new profile URL, update it
    if (updates.profile) {
      provider.profileImageUrl = updates.profile; // store Cloudinary URL using correct field name
    }

    // only allow certain fields to be updated
    const allowed = [
      "firstName",
      "lastName",
      "phone",
      "profession",
      "title",
      "experience",
      "bio",
    ];

    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        provider[field] = updates[field];
      }
    });

    await provider.save();

    res.json({ success: true, provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// provider sends a message to a user (creates a provider_message notification)
export const sendMessageToUser = async (req, res) => {
  try {
    const provider = req.provider; // providerAuth middleware adds req.provider
    const { userId } = req.params;
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ success:false, message: 'Message required' });

    // note: providers are separate model; we want a user (not a provider). Try User model dynamically.
    // require user model lazily to avoid circular imports up top.
    const User = (await import('../models/userModel.js')).default;
    const target = await User.findById(userId);
    if (!target) return res.status(404).json({ success:false, message: 'User not found' });

    const notif = await Notification.create({
      recipient: target._id,
      actor: provider._id,
      actorModel: 'Provider',
      type: 'provider_message',
      message,
      reference: null,
    });

    // try sending web push to the user if subscribed
    sendPushToUser(target._id, { title: 'Message from provider', body: message, data: { type: 'provider_message' } }).catch(() => {});

    // TODO: optionally send email to user via sendMail

    res.json({ success:true, message: 'Message sent' });
  } catch (err) {
    console.error('sendMessageToUser', err);
    res.status(500).json({ success:false, message: err.message });
  }
};

// Dashboard data endpoints
// Get provider dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const provider = req.provider;
    const User = (await import('../models/userModel.js')).default;
    const Mood = (await import('../models/moodModel.js')).default;

    const clientCount = 0; // placeholder: implement if you have a clients/session tracking model
    const pendingTasks = 0; // placeholder: implement if you have a tasks model
    const monthlySessions = 0; // placeholder: implement if you have a sessions model
    const riskCases = 0; // placeholder: implement if you have flagged users

    res.json({
      success: true,
      data: {
        clients: clientCount,
        tasks: pendingTasks,
        sessions: monthlySessions,
        riskCases,
      }
    });
  } catch (err) {
    console.error('getDashboardStats', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get provider's recent clients/users
export const getRecentClients = async (req, res) => {
  try {
    const provider = req.provider;
    const User = (await import('../models/userModel.js')).default;

    // fetch last 5 users (placeholder logic)
    const users = await User.find().select('firstName lastName email').sort({ createdAt: -1 }).limit(5);

    const clients = users.map(u => ({
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      lastVisit: new Date(u.createdAt).toLocaleDateString(),
    }));

    res.json({ success: true, data: clients });
  } catch (err) {
    console.error('getRecentClients', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get mood trends (last 7 days)
export const getMoodTrends = async (req, res) => {
  try {
    const Mood = (await import('../models/moodModel.js')).default;

    // Get moods from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await Mood.find({ date: { $gte: sevenDaysAgo } })
      .sort({ date: 1 })
      .lean();

    // Aggregate by day
    const dayMap = {};
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayStr = daysOfWeek[d.getDay()];
      dayMap[dayStr] = [];
    }

    moods.forEach(m => {
      const d = new Date(m.date);
      const dayStr = daysOfWeek[d.getDay()];
      if (dayStr && dayMap[dayStr]) {
        dayMap[dayStr].push(m.emoji || '😐');
      }
    });

    // Calculate average mood score (emoji to 1-5)
    const moodScore = (emoji) => {
      const scores = { '😢': 1, '😞': 2, '😐': 3, '🙂': 4, '😊': 5 };
      return scores[emoji] || 3;
    };

    const trendData = Object.entries(dayMap).map(([day, emojis]) => ({
      date: day,
      mood: emojis.length > 0 ? emojis.reduce((sum, e) => sum + moodScore(e), 0) / emojis.length : 3,
    }));

    res.json({ success: true, data: trendData });
  } catch (err) {
    console.error('getMoodTrends', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get high-risk clients (placeholder)
export const getRiskAlerts = async (req, res) => {
  try {
    // Placeholder: implement by checking journal entries or mood patterns for high-risk flags
    const riskList = [];
    res.json({ success: true, data: riskList });
  } catch (err) {
    console.error('getRiskAlerts', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get today's appointments
export const getTodayAppointments = async (req, res) => {
  try {
    const provider = req.provider;
    const Appointment = (await import('../models/appointmentModel.js')).default;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      provider: provider._id,
      dateTime: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' },
    })
      .populate('user', 'firstName lastName')
      .sort({ dateTime: 1 });

    const formatted = appointments.map(a => ({
      _id: a._id,
      client: `${a.user.firstName} ${a.user.lastName}`,
      time: new Date(a.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      mode: a.mode,
      type: a.type,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('getTodayAppointments', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get recent messages
export const getRecentMessages = async (req, res) => {
  try {
    const provider = req.provider;
    const Message = (await import('../models/messageModel.js')).default;

    const messages = await Message.find({ sender: provider._id })
      .populate('recipient', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    const formatted = messages.map(m => ({
      _id: m._id,
      from: `${m.recipient.firstName} ${m.recipient.lastName}`,
      preview: m.content.slice(0, 50) + (m.content.length > 50 ? '...' : ''),
      time: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: m.read,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('getRecentMessages', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Public: Get list of available therapists for users to browse
export const listAvailableTherapists = async (req, res) => {
  try {
    // Show approved providers (excluding admins), or all if no approved providers exist (for demo purposes)
    let therapists = await Provider.find({ status: 'approved', role: 'provider' })
      .select('firstName lastName profession title experience bio profileImageUrl')
      .lean();

    // If no approved providers, show pending providers for demo
    if (therapists.length === 0) {
      therapists = await Provider.find({ status: { $in: ['approved', 'pending'] }, role: 'provider' })
        .select('firstName lastName profession title experience bio profileImageUrl')
        .lean();
    }

    const formatted = therapists.map(t => ({
      _id: t._id,
      name: `${t.firstName} ${t.lastName}`,
      title: t.title,
      profession: t.profession,
      experience: t.experience,
      bio: t.bio,
      profile: t.profileImageUrl,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('listAvailableTherapists', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Public: Get therapist details
export const getTherapistProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await Provider.findById(id)
      .select('firstName lastName profession title experience bio profileImageUrl phone email')
      .lean();

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const formatted = {
      _id: therapist._id,
      name: `${therapist.firstName} ${therapist.lastName}`,
      title: therapist.title,
      profession: therapist.profession,
      experience: therapist.experience,
      bio: therapist.bio,
      profile: therapist.profileImageUrl,
      phone: therapist.phone,
      email: therapist.email,
    };

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('getTherapistProfile', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// User: Book an appointment with a therapist
export const bookAppointment = async (req, res) => {
  try {
    const user = req.user; // requires userAuth middleware
    const { providerId, dateTime, type, mode, notes } = req.body;

    if (!providerId || !dateTime || !type || !mode) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const Appointment = (await import('../models/appointmentModel.js')).default;

    // Create appointment
    const appointment = await Appointment.create({
      provider: providerId,
      user: user._id,
      dateTime: new Date(dateTime),
      type,
      mode,
      status: 'scheduled',
      notes: notes || '',
    });

    const populated = await appointment.populate('provider', 'firstName lastName');

    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: appointment });
  } catch (err) {
    console.error('bookAppointment', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



