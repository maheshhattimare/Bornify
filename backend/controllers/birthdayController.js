// controllers/birthdayController.js
import Birthday from "../models/Birthday.js";
import cloudinary from "../utils/cloudinary.js";

/**
 * Upload image to Cloudinary (helper)
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "bornify_birthdays" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};

/**
 * @desc Add a new birthday
 * @route POST /api/birthdays
 */
export const addBirthday = async (req, res) => {
  try {
    const { name, birthdate, relation, note, notifyBeforeDays } = req.body;

    if (!name || !birthdate) {
      return res
        .status(400)
        .json({ message: "Name and birthdate are required" });
    }

    let imageUrl = null;
    let cloudinaryId = null;

    // If user uploaded an image
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
      } catch (uploadError) {
        return res.status(500).json({
          message: "Image upload failed",
          error: uploadError.message,
        });
      }
    }

    // Save birthday
    const birthday = await Birthday.create({
      userId: req.user.id,
      name,
      birthdate,
      relation,
      note,
      imageUrl,
      cloudinaryId,
      notifyBeforeDays: notifyBeforeDays ?? 1, // default to 1 day before
    });

    res.status(201).json({ message: "Birthday added successfully", birthday });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all birthdays for logged‑in user
 * @route GET /api/birthdays
 */
export const getBirthdays = async (req, res) => {
  try {
    const birthdays = await Birthday.find({ userId: req.user.id }).sort({
      birthdate: 1,
    });
    res.status(200).json(birthdays);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update a birthday
 * @route PUT /api/birthdays/:id
 */
export const updateBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!birthday)
      return res.status(404).json({ message: "Birthday not found" });

    const { name, birthdate, relation, note, notifyBeforeDays } = req.body;

    // If new image uploaded, replace old one
    if (req.file) {
      // Delete old image if exists
      if (birthday.cloudinaryId) {
        await cloudinary.uploader.destroy(birthday.cloudinaryId);
      }

      try {
        const result = await uploadToCloudinary(req.file.buffer);
        birthday.imageUrl = result.secure_url;
        birthday.cloudinaryId = result.public_id;
      } catch (uploadError) {
        return res
          .status(500)
          .json({ message: "Image upload failed", error: uploadError.message });
      }
    }

    // Update other fields
    if (name) birthday.name = name;
    if (birthdate) birthday.birthdate = birthdate;
    if (relation) birthday.relation = relation;
    if (note !== undefined) birthday.note = note;
    if (notifyBeforeDays !== undefined)
      birthday.notifyBeforeDays = notifyBeforeDays;

    await birthday.save();
    res
      .status(200)
      .json({ message: "Birthday updated successfully", birthday });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete a birthday
 * @route DELETE /api/birthdays/:id
 */
export const deleteBirthday = async (req, res) => {
  try {
    const birthday = await Birthday.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!birthday)
      return res.status(404).json({ message: "Birthday not found" });

    // Delete image from Cloudinary if exists
    if (birthday.cloudinaryId) {
      await cloudinary.uploader.destroy(birthday.cloudinaryId);
    }

    await birthday.deleteOne();
    res.status(200).json({ message: "Birthday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
