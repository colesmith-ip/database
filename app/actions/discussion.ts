'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

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
  try {
    const posts = await prisma.post.findMany({
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
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw new Error('Failed to fetch posts')
  }
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
