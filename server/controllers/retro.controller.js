const Retro = require('../models/Retro');

createRetro = (req, res) => {
    if(!req.body) {
        return res.status(400).json({
            success: false,
            error: 'ERROR: Retro data was not provided'
        });
    }

    const retro = new Retro(req.body);

    retro.save().then(() => {
        return res.status(201).json({
            success: true,
            id: retro._id
        });
    })
    .catch(error => {
        return res.status(400).json({
            success: false,
            error
        });
    });
};

getRetroById = async (req, res) => {
    await Retro.findOne({ _id: req.params.id}, (err, retro) => {
        if(err){
            return res.status(400).json({success: false, error: err});
        }

        return res.status(200).json({success: true, data: retro});
    }).catch(err => console.log(err));
};

getRetros = async (req, res) => {
    await Retro.find({}, (err, retros) => {
        if(err){
            return res.status(400).json({success: false, error: err});
        }
        if(!retros.length){
            return res.status(404).json({
                success: false,
                error: 'No Retros found'
            });
        }
        return res.status(200).json({success: true, data: retros});
    });
};

module.exports = {
    createRetro,
    getRetroById,
    getRetros
};
