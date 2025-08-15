'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

// Helper function to safely execute database queries
async function safeDbQuery<T>(queryFn: () => Promise<T>): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    
    // During build time, database connection might not be available
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
      console.warn('Database connection not available during build, returning null')
      return null
    }
    
    // In production runtime, return null instead of throwing to prevent crashes
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database connection failed in production, returning null')
      return null
    }
    
    // In development, throw the error for debugging
    throw new Error(`Failed to execute database query: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export interface PostWithDetails {
  id: string
  content: string
  authorName: string
  authorEmail: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    comments: number
    likes: number
  }
  comments: Array<{
    id: string
    content: string
    authorName: string
    authorEmail: string | null
    createdAt: Date
  }>
  likes: Array<{
    id: string
    authorEmail: string
  }>
}

export async function getPosts(): Promise<PostWithDetails[]> {
  const result = await safeDbQuery(async () => {
    return await prisma.post.findMany({
      include: {
        _count: {
          select: {
            comments: true,
            likes: true
          }
        },
        comments: {
          orderBy: { createdAt: 'asc' }
        },
        likes: true
      },
      orderBy: { createdAt: 'desc' }
    })
  })
  
  // Return empty array if database is not available during build
  return result || []
}

export async function createPost(content: string, authorName: string, authorEmail?: string) {
  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorName,
        authorEmail
      }
    })
    revalidatePath('/')
    return post
  } catch (error) {
    console.error('Error creating post:', error)
    throw new Error('Failed to create post')
  }
}

export async function createComment(postId: string, content: string, authorName: string, authorEmail?: string) {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorName,
        authorEmail
      }
    })
    revalidatePath('/')
    return comment
  } catch (error) {
    console.error('Error creating comment:', error)
    throw new Error('Failed to create comment')
  }
}

export async function toggleLike(postId: string, authorEmail: string) {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_authorEmail: {
          postId,
          authorEmail
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_authorEmail: {
            postId,
            authorEmail
          }
        }
      })
    } else {
      await prisma.like.create({
        data: {
          postId,
          authorEmail
        }
      })
    }
    
    revalidatePath('/')
    return { liked: !existingLike }
  } catch (error) {
    console.error('Error toggling like:', error)
    throw new Error('Failed to toggle like')
  }
}

export async function deletePost(postId: string) {
  try {
    await prisma.post.delete({
      where: { id: postId }
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }
}

export async function deleteComment(commentId: string) {
  try {
    await prisma.comment.delete({
      where: { id: commentId }
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw new Error('Failed to delete comment')
  }
}
