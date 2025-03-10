
import Club from '../models/Club.js';
import User from '../models/User.js';

// Get all clubs
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({})
      .populate('admins', 'username name avatar')
      .populate('members', 'username name avatar');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single club
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('admins', 'username name avatar')
      .populate('members', 'username name avatar')
      .populate({
        path: 'posts',
        populate: {
          path: 'author',
          select: 'username name avatar'
        }
      });

    if (club) {
      res.json(club);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new club
export const createClub = async (req, res) => {
  try {
    const { name, description, university, coverImage } = req.body;

    const club = await Club.create({
      name,
      description,
      university,
      coverImage,
      admins: [req.user._id],
      members: [req.user._id]
    });

    // Add club to user's adminOfClubs and joinedClubs
    await User.findByIdAndUpdate(req.user._id, {
      $push: { adminOfClubs: club._id, joinedClubs: club._id }
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a club
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is an admin
    if (!club.admins.includes(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized to update this club' });
    }

    const { name, description, university, coverImage } = req.body;

    club.name = name || club.name;
    club.description = description || club.description;
    club.university = university || club.university;
    club.coverImage = coverImage || club.coverImage;

    const updatedClub = await club.save();
    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a club
export const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is already a member
    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this club' });
    }

    // Add user to club members
    club.members.push(req.user._id);
    await club.save();

    // Add club to user's joinedClubs
    await User.findByIdAndUpdate(req.user._id, {
      $push: { joinedClubs: club._id }
    });

    res.json({ message: 'Successfully joined the club' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a club
export const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is a member
    if (!club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not a member of this club' });
    }

    // Check if user is the only admin
    if (club.admins.length === 1 && club.admins.includes(req.user._id)) {
      return res.status(400).json({ message: 'Cannot leave club as you are the only admin' });
    }

    // Remove user from club members and admins
    club.members = club.members.filter(id => id.toString() !== req.user._id.toString());
    club.admins = club.admins.filter(id => id.toString() !== req.user._id.toString());
    await club.save();

    // Remove club from user's joinedClubs and adminOfClubs
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { joinedClubs: club._id, adminOfClubs: club._id }
    });

    res.json({ message: 'Successfully left the club' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
