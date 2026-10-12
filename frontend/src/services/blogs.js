import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = async () => {
  const config = token
    ? {
      headers: { Authorization: token },
    }
    : {}

  const request = await axios.get(baseUrl, config)
  return request.data
}

const create = async (newBlog) => {
  const config = token
    ? {
      headers: { Authorization: token },
    }
    : {}

  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const update = async (id, updatedBlog) => {
  const config = token
    ? {
      headers: { Authorization: token },
    }
    : {}

  const request = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return request.data
}

const remove = async (id) => {
  const config = token
    ? {
      headers: { Authorization: token },
    }
    : {}

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove, setToken }