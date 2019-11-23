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

        return res.status(200).json({success: true, retro: retro});
    }).catch(err => console.log(err));
};

getRetros = async (req, res) => {
    await Retro.find({userId: req.params.userId}, (err, retros) => {
        if(err){
            return res.status(400).json({success: false, error: err});
        }
        if(!retros.length){
            return res.status(404).json({
                success: false,
                error: 'No Retros found'
            });
        }
        return res.status(200).json({success: true, retros: retros});
    });
};

updateRetro = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a retro to update'
        });
    }

    Retro.findOne({ _id: req.params.id }, (err, retro) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        retro.name = req.body.name;
        retro.startDate = req.body.startDate;
        retro.endDate = req.body.endDate;
        retro.numberOfVote = req.body.numberOfVotes;
        retro
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: retro._id,
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error
                });
            });
    })
};

deleteRetro = async (req, res) => {
    await Retro.findOneAndDelete({ _id: req.params.id }, (err, retro) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!retro) {
            return res
                .status(404)
                .json({ success: false, error: `Retro not found` });
        }

        return res.status(200).json({ success: true, data: retro });
    }).catch(err => console.log(err));
};

module.exports = {
    createRetro,
    getRetroById,
    getRetros,
    updateRetro,
    deleteRetro
};
