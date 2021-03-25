const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Image = require("../models/image");

// Get Image by ID
router.get("/:imageId", (req, res, next) => {
  const id = req.params.imageId;
  Image.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          image: doc,
          request: {
            type: "POST",
            url: "http://localhost:5000/images/",
          },
        });
      } else {
        res.status(404).json({
          message: "Image not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Upload Image
router.post("/", upload.single("image"), (req, res, next) => {
  const image = new Image({
    _id: new mongoose.Types.ObjectId(),
    image: req.file.path,
  });

  image
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Image uploaded successfully",
        request: {
          type: "GET",
          url: `http://localhost:5000/images/${result._id}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Delete Image
router.delete("/:imageId", (req, res, next) => {
  const id = req.params.imageId;
  Image.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Image deleted",
        request: {
          type: "POST",
          url: "http://localhost:5000/images/",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
