const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password)
    return response
      .status(400)
      .json({ error: 'include password with user posting' })
  if (body.password.length < 3)
    return response
      .status(400)
      .json({ error: 'password must be greater than 3 characters' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  console.log(user)

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})
module.exports = usersRouter