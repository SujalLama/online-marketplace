const Auction = require('../models/auction.model')
const errorHandler = require('../helpers/dbErrorHandler')

const create = async (req, res) => {
  const {itemName, description, startingBid, bidStart, bidEnd} = req.body
  let filename = '';
  if(req.file) {
    filename = req.file.filename
  }
  let auction = new Auction({itemName, description, startingBid, bidStart, bidEnd, seller : req.profile, image: 'auction/'+filename});
    try {
      let result = await auction.save()
      res.status(200).json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const auctionByID = async (req, res, next, id) => {
  try {
    let auction = await Auction.findById(id).populate('seller', '_id name').populate('bids.bidder', '_id name').exec()
    if (!auction)
      return res.status('400').json({
        error: "Auction not found"
      })
    req.auction = auction
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve auction"
    })
  }
}

const photo = (req, res, next) => {
  if(req.auction.image.data){
    res.set("Content-Type", req.auction.image.contentType)
    return res.send(req.auction.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  // return res.sendFile(process.cwd()+defaultImage)
}

const read = (req, res) => {
  return res.json(req.auction)
}

const update = async (req, res) => {
  const {itemName, description, startingBid, bidStart, bidEnd} = req.body
  let filename = '';
  if(req.file) {
    filename = req.file.filename
  }

  let auction = req.auction
  if(filename) {
    auction.image = 'auction/' + filename
  }
  auction.itemName = itemName
  auction.description = description
  auction.startingBid = startingBid
  auction.bidStart = bidStart
  auction.bidEnd = bidEnd
  auction.updated = Date.now()
    try {
      let result = await auction.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let auction = req.auction
    let deletedAuction = auction.remove()
    res.json(deletedAuction)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }  
}

const listOpen = async (req, res) => {
  try {
    let auctions = await Auction.find({ 'bidEnd': { $gt: new Date() }}).sort('bidStart').populate('seller', '_id name').populate('bids.bidder', '_id name')
    res.json(auctions)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const listBySeller = async (req, res) => {
  try {
    let auctions = await Auction.find({seller: req.profile._id}).populate('seller', '_id name').populate('bids.bidder', '_id name')
    res.json(auctions)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const listByBidder = async (req, res) => {
  try {
    let auctions = await Auction.find({'bids.bidder': req.profile._id}).populate('seller', '_id name image').populate('bids.bidder', '_id name')
    res.json(auctions)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isSeller = (req, res, next) => {
  const isSeller = req.auction && req.auth && req.auction.seller._id.toString() === req.auth._id.toString()
  if(!isSeller){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports = {
  create,
  auctionByID,
  photo,
  defaultPhoto,
  listOpen,
  listBySeller,
  listByBidder,
  read,
  update,
  isSeller,
  remove
}
