const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ExchangeRequest = require("../models/ExchangeRequest");

const registerUser = async (req, res, next) => {
  const { age, password, fullname, email } = req.body;

  console.log(age)


  try {
    // Check for empty fields
    if (!age || !password || !fullname || !email) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    // Check for password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?~\\-])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must include a combination of Uppercase letters, Lowercase letters, Numbers, Special characters (e.g., !, @, #, $)",
      });
    }

    // Check for password length
    const minLength = 8;
    if (password.length < minLength) {
      return res.status(400).json({
        error: `Password length should be at least ${minLength} characters.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      age,
      password: hashedPassword,
      fullname,
      email,
    });

    // Update password history for the newly registered user
    user.passwordHistory.push(hashedPassword);
    // Trim the password history to a specific depth (e.g., last 5 passwords)
    const passwordHistoryDepth = 5;
    user.passwordHistory = user.passwordHistory.slice(-passwordHistoryDepth);

    await user.save();

    res.status(201).json({ status: "success", message: "User created" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    console.log(user);

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!user) {
      return res.status(400).json({ error: "User is not registered" });
    }

    // Check if the account is locked
    if (user.accountLocked) {
      // Check if it's time to unlock the account
      const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
      const lockoutDurationSeconds = lockoutDurationMillis / 1000; // convert to seconds

      if (lockoutDurationSeconds >= 120) {
        // 2 minutes in seconds
        // Unlock the account
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await user.save();
      } else {
        // Calculate the time remaining for the account lockout period
        const timeRemainingSeconds = 120 - lockoutDurationSeconds;
        const minutes = Math.floor(timeRemainingSeconds / 60);
        const seconds = Math.floor(timeRemainingSeconds % 60);

        return res.status(400).json({
          error: `Account is locked. Please try again later after ${minutes} minutes and ${seconds} seconds.`,
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts and update last failed login timestamp
      user.failedLoginAttempts += 1;
      user.lastFailedLoginAttempt = Date.now();

      // Check if the maximum allowed failed attempts is reached
      if (user.failedLoginAttempts >= 4) {
        // Lock the account
        user.accountLocked = true;
        await user.save();
        return res
          .status(400)
          .json({ error: "Account is locked. Please try again later." });
      }

      // Save the updated user data
      await user.save();

      return res.status(400).json({ error: "Password does not match" });
    }

    // Reset failed login attempts and last failed login timestamp on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAttempt = null;
    await user.save();

    // Check if the account is still locked after successful login
    if (user.accountLocked) {
      return res
        .status(400)
        .json({ error: "Account is locked. Please try again later." });
    }

    // If everything is fine, generate and send the JWT token
    const payload = {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        /* istanbul ignore next */
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: "success", token: token, user: user });
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      data: [user],
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getUserInfoById = async (req, res, next) => {
  const userId = req.params.user_id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      /* istanbul ignore next */
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Check if the new password is different from the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password",
      });
    }

    // Check if the new password is in the password history
    const isPasswordInHistory = await Promise.all(
      user.passwordHistory.map(async (oldPassword) => {
        return await bcrypt.compare(newPassword, oldPassword);
      })
    );

    if (isPasswordInHistory.includes(true)) {
      return res.status(400).json({
        error: "New password cannot be one of the recent passwords",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and set the new password change date
    user.password = hashedNewPassword;
    user.passwordChangeDate = new Date();

    // Save the updated user
    await user.save();

    // Update the password history
    user.passwordHistory.push(hashedNewPassword);
    // Trim the password history to a specific depth (e.g., last 5 passwords)
    const passwordHistoryDepth = 5;
    user.passwordHistory = user.passwordHistory.slice(-passwordHistoryDepth);

    await user.save();

    res.status(204).json({ message: "Password updated successfully" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { age, fullname, email, bio, phoneNumber } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (fullname && fullname !== "" && fullname !== user.fullname) {
      user.fullname = fullname;
    }
    if (age !== undefined ) {
      user.age = age;
    }
    if (email && email !== "" && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email: email });
      if (existingUserWithEmail) {
        /* istanbul ignore next */
        return res.status(400).json({ error: "Email is already taken" });
      }
      user.email = email;
    }
    if (bio !== undefined && bio !== user.bio) {
      user.bio = bio;
    }
    if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
      const existingUserWithPhoneNumber = await User.findOne({
        phoneNumber: phoneNumber,
      });
      if (existingUserWithPhoneNumber) {
        return res.status(400).json({ error: "Phone number is already taken" });
      }
      user.phoneNumber = phoneNumber;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.json({
      data: [updatedUser],
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

// Get all exchange requests for a user
const getAllExchangeRequests = async (req, res, next) => {
  try {
    const userId = req.params.user_id;

    const exchangeRequests = await ExchangeRequest.find({
      requester: userId,
    });

    res.json(exchangeRequests);
  } catch (error) {
    /* istanbul ignore next */
  }
};

/* istanbul ignore next */
const uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  // Update the user's profile picture in the database
  const userId = req.user.id;
  const image = req.file.filename;

  User.findByIdAndUpdate(userId, { image })
    .then(() => {
      res.status(200).json({
        success: true,
        data: image,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to update the user's profile picture",
      });
    });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserInfoById,
  updateUserProfile,
  updatePassword,
  getAllExchangeRequests,
  uploadImage,
};
