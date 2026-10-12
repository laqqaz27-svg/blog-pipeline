import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogUserId = typeof blog.user === 'string'
    ? blog.user
    : blog.user?.id || blog.user?._id

  const currentUserId = user?.id || user?._id

  const canDelete = Boolean(user) && (
    blog.user?.username === user.username || blogUserId === currentUserId
  )

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }


  return (
    <div className="blog" style={{
      padding: 10,
      paddingLeft: 2,
      border: '1px solid black',
      marginBottom: 5 }}>
      <div>
        {blog.title} {blog.author}
        <button type="button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button type="button" onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {canDelete && (
            <div>
              <button type="button" onClick={handleDelete}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog