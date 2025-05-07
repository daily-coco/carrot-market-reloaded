'use client';
import db from '@/lib/db';
import { formatToTimeAgo } from '@/lib/utils';
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

async function getPosts() {
  // await new Promise((r) => setTimeout(r, 100000));
  // POST DB 가져오기
  const posts = await db.post.findMany({
    select: {
      id: true, //id도 가져오고
      title: true, //title도 가져오고
      description: true, // 설명글도 가져오고
      views: true,
      created_at: true,
      _count: {
        // reverse relationship 계산을 할 수 있다. // 즉, 여기서는 Post를 가리키는 좋아요와 댓글의 갯수를 구할 수 있다.
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts;
}

export const metadata = {
  title: '동네생활',
};

export default async function Life() {
  const posts = await getPosts();
  // console.log(posts);
  return (
    <div className='p-5 flex flex-col'>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className='pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0'
        >
          <h2 className='text-white text-lg font-semibold'>{post.title}</h2>
          <p>{post.description}</p>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex gap-4 items-center'>
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className='flex gap-4 items-center *:flex *:gap-1 *:items-center'>
              <span>
                <HandThumbUpIcon className='size-4' />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className='size-4' />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
