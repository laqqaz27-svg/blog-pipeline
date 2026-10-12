const router = require('express').Router()

const Blog = require('../Models/blogs')
const User = require('../Models/user')

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router