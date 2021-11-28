const Shop = require('../models/shop.model')
const extend = require('lodash/extend')
const errorHandler = require('./../helpers/dbErrorHandler')


const create = async (req, res) => {
  const {name, description} = req.body
  let filename = '';
  if(req.file) {
    filename = req.file.filename
  }
  let shop = new Shop({name, image: 'shop/' + filename, description})
  shop.owner = req.profile;
    try {
      let result = await shop.save()
      res.status(200).json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  
}

const shopByID = async (req, res, next, id) => {
  try {
    let shop = await Shop.findById(id).populate('owner', '_id name').exec()
    if (!shop)
      return res.status('400').json({
        error: "Shop not found"
      })
    req.shop = shop
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve shop"
    })
  }
}

const photo = (req, res, next) => {
  if(req.shop.image.data){
    res.set("Content-Type", req.shop.image.contentType)
    return res.send(req.shop.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  // return res.sendFile(process.cwd()+defaultImage)
}

const read = (req, res) => {
  return res.json(req.shop)
}

const update = async (req, res) => {
  const {name, description} = req.body
  let filename = '';
  if(req.file) {
    filename = req.file.filename
  }

  let shop = req.shop
  if(filename) {
    shop.image = '/shop' + filename
    shop.updated = Date.now()
  }
    shop.name = name
    shop.description = description
    shop.updated = Date.now()

    try {
      let result = await shop.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let shop = req.shop
    let deletedShop = shop.remove()
    res.json(deletedShop)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }  
}

const list = async (req, res) => {
  try {
    let shops = await Shop.find()
    res.json(shops)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByOwner = async (req, res) => {
  try {
    let shops = await Shop.find({owner: req.profile._id}).populate('owner', '_id name')
    res.json(shops)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id.toString() === req.auth._id.toString()
  if(!isOwner){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports = {
  create,
  shopByID,
  photo,
  defaultPhoto,
  list,
  listByOwner,
  read,
  update,
  isOwner,
  remove
}
