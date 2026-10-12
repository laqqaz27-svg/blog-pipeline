const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const style = {
    padding: '10px',
    marginBottom: '10px',
    border: '2px solid green',
    color: 'green',
    background: '#f4f4f4',
    fontSize: '16px',
  }

  return <div style={style}>{notification.message}</div>
}

export default Notification
