export const importBranches = async (req, res) => {

    console.log(req.file);

    res.json({
        success: true,
        message: "File uploaded successfully"
    });

};