const Item = require('../models/Item');

createItem = (req, res) => {
    if(!req.body) {
        return res.status(400).json({
            success: false,
            error: 'ERROR: Item data was not provided'
        });
    }

    const item = new Item(req.body);
    item.save().then(() => {
        return res.status(201).json({
            success: true,
            id: item._id
        });
    })
    .catch(error => {
        return res.status(400).json({
            success: false,
            error
        });
    });
};

getItemById = async (req, res) => {
    await Item.findOne({ _id: req.params.id}, (err, item) => {
        if(err){
            return res.status(400).json({success: false, error: err});
        }

        return res.status(200).json({success: true, item: item});
    }).catch(err => console.log(err));
};


getItems = async (req, res) => {
    await Item.find({retroId: req.params.id, columnName: req.params.columnId}, (err, items) => {
        if(err){
            return res.status(400).json({success: false, error: err});
        }
        return res.status(200).json({success: true, items: items})
    });
};

updateItem = (req, res) => {
    if(!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an item to delete'
        })
    }
    Item.findOne({ _id: req.params.id }, (err, item) => {
        if(err){
            return res.status(400).json({
                success: false,
                error: err
            });
        }
        item.value = req.body.value;

        item.save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: item._id
                });
            })
            .catch(err => {
                return res.status(404).json({
                    success: false,
                    error: err
                });
            });
    })
};

deleteItem = async (req, res) => {
    await Item.findOneAndDelete({ _id: req.params.id }, (err, item) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }

        if (!item) {
            return res.status(404).json({ success: false, error: `Item not found`})
        }

        return res.status(200).json({ success: true, data: item});
    }).catch(err => console.log(err));
};

module.exports = {
    createItem,
    getItemById,
    getItems,
    updateItem,
    deleteItem
};