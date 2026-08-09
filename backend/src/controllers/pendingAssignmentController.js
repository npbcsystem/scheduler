import PendingAssignment from "../models/PendingAssignment.js";

export const getPendingAssignments = async (req, res) => {

    try {

        const pending = await PendingAssignment.find({
            status: "PENDING"
        })
        .populate("branch")
        .populate("suggestedCourse");

        res.json(pending);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};