import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const getLoginErrorMessage = (exception) => {
    if (exception.response?.status === 401) {
      return 'wrong credentials'
    }

    return 'unable to reach login service'
  }

  useEffect(() => {
    const storedUser = window.localStorage.getItem('loggedBlogappUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  useEffect(() => {
    if (user === null) return

    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: username.trim(),
        password: password.trim(),
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setErrorMessage(null)
    } catch (exception) {
      setErrorMessage(getLoginErrorMessage(exception))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({
        title: title.trim(),
        author: author.trim(),
        url: url.trim(),
      })

      setBlogs(blogs.concat(createdBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setShowCreateForm(false)
      setErrorMessage(null)
    } catch {
      setErrorMessage('failed to create blog')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user,
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs(
        blogs.map(b =>
          b.id === blog.id ? returnedBlog : b
        )
      )
    } catch  {
      setErrorMessage('failed to like blog')
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)

      setBlogs(
        blogs.filter(b => b.id !== blog.id)
      )
    } catch  {
      setErrorMessage('failed to delete blog')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">login</button>
        </form>

        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        create new blog
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateBlog}>
          <div>
            <label htmlFor="title">title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>

          <div>
            <label htmlFor="author">author</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>

          <div>
            <label htmlFor="url">url</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>

          <button type="submit">create</button>
        </form>
      )}


      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        ))}

      {errorMessage && (
        <div className="error">{errorMessage}</div>
      )}
    </div>
  )
}

export default App
