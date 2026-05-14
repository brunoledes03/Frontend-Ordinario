import { useState, useEffect } from 'react'
import axios from 'axios'
import './Comments.css'

export default function Comments({ heroId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState({ text: '', rating: 5 })
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(5)

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const username = localStorage.getItem('username')
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Cargar comentarios
  useEffect(() => {
    if (!heroId) return
    fetchComments()
  }, [heroId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/comments?heroId=${heroId}`)
      setComments(response.data)
      setError('')
    } catch (err) {
      setError('Error al cargar comentarios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!token) {
      setError('Debes iniciar sesión para comentar')
      return
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/comments`,
        {
          heroId: String(heroId),
          text: newComment.text,
          rating: parseInt(newComment.rating)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setComments([response.data, ...comments])
      setNewComment({ text: '', rating: 5 })
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar comentario')
    }
  }

  const handleUpdateComment = async (commentId) => {
    if (!token) return

    try {
      const response = await axios.put(
        `${backendUrl}/api/comments/${commentId}`,
        {
          text: editText,
          rating: parseInt(editRating)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setComments(comments.map(c => c._id === commentId ? response.data : c))
      setEditingId(null)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar comentario')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!token) return

    try {
      await axios.delete(`${backendUrl}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setComments(comments.filter(c => c._id !== commentId))
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar comentario')
    }
  }

  const StarRating = ({ rating, editable = false, onChange = null }) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => editable && onChange && onChange(star)}
          style={{ cursor: editable ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
    </div>
  )

  const startEditing = (comment) => {
    setEditingId(comment._id)
    setEditText(comment.text)
    setEditRating(comment.rating)
  }

  return (
    <div className="comments-section">
      <h2>Comentarios ({comments.length})</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Formulario para agregar comentario */}
      {token ? (
        <form onSubmit={handleAddComment} className="add-comment-form">
          <div className="form-group">
            <label>Tu comentario ({newComment.text.length}/500):</label>
            <textarea
              value={newComment.text}
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              placeholder="Escribe tu opinión sobre este héroe..."
              minLength="5"
              maxLength="500"
              required
              rows="3"
            />
          </div>

          <div className="rating-group">
            <label>Puntuación:</label>
            <StarRating
              rating={newComment.rating}
              editable={true}
              onChange={(r) => setNewComment({ ...newComment, rating: r })}
            />
          </div>

          <button type="submit" className="submit-btn">Publicar Comentario</button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Inicia sesión para dejar un comentario</p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="comments-list">
        {loading ? (
          <p className="loading">Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">Aún no hay comentarios. ¡Sé el primero!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="user-info">
                  <strong className="username">{comment.userId.username}</strong>
                  <span className="timestamp">
                    {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <StarRating rating={comment.rating} />
              </div>

              {editingId === comment._id ? (
                <div className="edit-form">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    minLength="5"
                    maxLength="500"
                    rows="3"
                  />
                  <div className="edit-rating">
                    <StarRating
                      rating={editRating}
                      editable={true}
                      onChange={setEditRating}
                    />
                  </div>
                  <div className="edit-buttons">
                    <button onClick={() => handleUpdateComment(comment._id)} className="save-btn">
                      Guardar
                    </button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}

              {userId === comment.userId._id && !editingId && (
                <div className="comment-actions">
                  <button
                    onClick={() => startEditing(comment)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
