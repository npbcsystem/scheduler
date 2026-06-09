import Branch from "../models/Branch.js";

export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();

    res.json(branches);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(
      req.params.id
    );

    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }

    res.json({
      message: "Branch deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};