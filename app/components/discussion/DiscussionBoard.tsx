import { getPosts } from '../../actions/discussion'
import CreatePostForm from './CreatePostForm'
import PostCard from './PostCard'

export default async function DiscussionBoard() {
  const posts = await getPosts()

  return (
    <div className="max-w-4xl mx-auto">
      <CreatePostForm />
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No posts yet. Be the first to share an encouragement!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}

