'use client'

import { useState } from 'react'
import { PostWithDetails, createComment, toggleLike, deletePost, deleteComment } from '../../actions/discussion'

interface PostCardProps {
  post: PostWithDetails
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentAuthorName, setCommentAuthorName] = useState('')
  const [commentAuthorEmail, setCommentAuthorEmail] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!post.authorEmail) return
    setIsLiking(true)
    try {
      await toggleLike(post.id, post.authorEmail)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !commentAuthorName.trim()) return

    setIsSubmittingComment(true)
    try {
      await createComment(post.id, newComment, commentAuthorName, commentAuthorEmail || undefined)
      setNewComment('')
      setCommentAuthorName('')
      setCommentAuthorEmail('')
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeletePost = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id)
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId)
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
    }
  }

  const isLiked = post.likes.some(like => like.authorEmail === post.authorEmail)
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
        <button
          onClick={handleDeletePost}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
      
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleLike}
          disabled={isLiking || !post.authorEmail}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            isLiked 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>❤️</span>
          <span>{post._count.likes}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
        >
          <span>💬</span>
          <span>{post._count.comments}</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t pt-4">
          <h5 className="font-medium mb-3">Comments</h5>
          
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{comment.authorName}</p>
                  <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
            </div>
          ))}

          <form onSubmit={handleComment} className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={commentAuthorName}
                onChange={(e) => setCommentAuthorName(e.target.value)}
                placeholder="Your name"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                value={commentAuthorEmail}
                onChange={(e) => setCommentAuthorEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim() || !commentAuthorName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? '...' : 'Comment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

