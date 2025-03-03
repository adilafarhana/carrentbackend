const { verifytoken } = require("../helper/index")

const adminRequird = async (req, res, next) => {
  try {
    

    const token = req?.headers?.authorization?.split(" ")?.[1]
    console.log(token)
    const decodedData = await verifytoken(token)
    console.log(decodedData)
    if (!decodedData?.isAdmin) return res.json({ messge: "You don't have access to this resources" })
    
    next()
  } catch (error) {
    console.log(error)
    res.json({ messge: "You don't have access to this resources" })
  }
}

const userRequird = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")?.[1]
    const decodedData = await verifytoken(token)
    console.log(decodedData)
    if (!decodedData?.userId) return res.json({ messge: "You don't have access to this resources" })
    req.user = {
      id: decodedData?.userId
    }
    next()
  } catch (error) {
    console.log(error)
    res.json({ messge: "You don't have access to this resources" })
  }
}


module.exports = {
  adminRequird,
  userRequird
}