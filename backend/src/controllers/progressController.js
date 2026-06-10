import Progress from "../models/Progress.js";

export const createProgress = async (
  req,
  res
) => {
  try {

    const progress =
      await Progress.create(req.body);

    res.status(201).json(progress);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const getProgress = async (
  req,
  res
) => {
  try {

    const progress =
      await Progress.find()
        .populate("branch")
        .populate("completedCourses");

    res.json(progress);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const addCompletedCourse =
  async (req, res) => {

    try {

      const progress =
        await Progress.findById(
          req.params.id
        );

      if (!progress) {

        return res.status(404).json({
          message:
            "Progress not found"
        });

      }

      progress.completedCourses.push(
        req.body.courseId
      );

      await progress.save();

      res.json(progress);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
};