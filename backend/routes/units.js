const express = require('express');
const multer = require('multer');

const Unit = require('../models/unit');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images/unit');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  '',
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    // console.log(url);
    // console.log(req.body);
    const unit = new Unit({
      unitName: req.body.unitName,
      orientation: req.body.orientation,
      floor: req.body.floor,
      bedroom: req.body.bedroom,
      washroom: req.body.washroom,
      area: req.body.area,
      rent: req.body.rent,
      imagePath: url + '/images/unit/' + req.file.filename,
      hostId: req.body.hostId,
    });
    console.log('req.unit');
     console.log(req.unit);
    // return res.status(200).json({});
    unit.save().then(createdUnit => {
      res.status(201).json({
        message: 'Unit added successfully',
        unit: {
          ...createdUnit,
          id: createdUnit._id
      }
    });
  });
});

router.put(
  '/:id',
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/unit/' + req.file.filename;
    }
    const unit = new Unit({
      _id: req.body.id,
      unitName: req.body.unitName,
      orientation: req.body.orientation,
      floor: req.body.floor,
      bedroom: req.body.bedroom,
      washroom: req.body.washroom,
      area: req.body.area,
      rent: req.body.rent,
      hostId: req.body.hostId,
      imagePath: imagePath
  });
  // console.log(unit);
    Unit.updateOne({ _id: req.params.id }, unit).then(result => { // 第二个参数creator用于验证创建者身份, 这里不需要了。
    console.log(result);
    res.status(200).json({message: 'Update successfully!'});
  });
});

router.get('', (req, res, next) => {
  // console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const unitQuery = Unit.find();
  let fetchedUnits;
  if (pageSize && currentPage) {
    unitQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  unitQuery
    .then(documents => {
      console.log('imagePath[1] is ' + documents.length);
      // console.log('imagePath[1] is ' + documents.units[1].imagePath);
      fetchedUnits = documents;
      console.log('fetched data： '+ fetchedUnits );
      return Unit.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Units fetched successfully!',
        units: fetchedUnits,
        maxUnits: count
      });
    });
});

router.get('/:id', (req, res, next) =>  {
  Unit.findById(req.params.id).then(unit => {
    if(unit) {
      res.status(200).json(unit);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  console.log(checkAuth);
  Unit.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: 'unit deleted!'});
  });
});

module.exports = router;
