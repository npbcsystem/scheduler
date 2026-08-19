import Branch from "../models/Branch.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";

export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();

    res.json(branches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    const {
      name,
      region,
      levels,
      week,
      active,
      coordinatorName,
      coordinatorPhone,
    } = req.body;

    // ---------------------------------------------
    // Validate levels
    // ---------------------------------------------

    const allowedLevels = ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"];

    if (levels !== undefined) {
      if (!Array.isArray(levels)) {
        return res.status(400).json({
          message: "Levels must be an array.",
        });
      }

      const invalidLevels = levels.filter(
        (level) => !allowedLevels.includes(level),
      );

      if (invalidLevels.length > 0) {
        return res.status(400).json({
          message: `Invalid levels: ${invalidLevels.join(", ")}`,
        });
      }
    }

    // ---------------------------------------------
    // Validate week
    // ---------------------------------------------

    if (week !== undefined && ![1, 2, 3, 4].includes(Number(week))) {
      return res.status(400).json({
        message: "Week must be between 1 and 4.",
      });
    }

    // ---------------------------------------------
    // Check removed levels
    // ---------------------------------------------

    if (levels !== undefined) {
      const oldLevels = branch.levels || [];

      const removedLevels = oldLevels.filter(
        (level) => !levels.includes(level),
      );

      for (const level of removedLevels) {
        const progress = await Progress.findOne({
          branch: branch._id,
          level,
        });

        const scheduleCount = await Schedule.countDocuments({
          branch: branch._id,
          level,
        });

        if (progress || scheduleCount > 0) {
          return res.status(409).json({
            message: `Cannot remove ${level}. This branch already has academic records for this level.`,
            level,
            progressExists: !!progress,
            scheduleCount,
          });
        }
      }
    }

    // ---------------------------------------------
    // Update branch
    // ---------------------------------------------

    if (name !== undefined) {
      branch.name = name;
    }

    if (region !== undefined) {
      branch.region = region;
    }

    if (levels !== undefined) {
      branch.levels = levels;
    }

    if (week !== undefined) {
      branch.week = Number(week);
    }

    if (active !== undefined) {
      branch.active = active;
    }

    if (coordinatorName !== undefined) {
      branch.coordinatorName = coordinatorName;
    }

    if (coordinatorPhone !== undefined) {
      branch.coordinatorPhone = coordinatorPhone;
    }

    await branch.save();

    res.json(branch);
  } catch (error) {
    console.error("UPDATE BRANCH ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    res.json({
      message: "Branch deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
