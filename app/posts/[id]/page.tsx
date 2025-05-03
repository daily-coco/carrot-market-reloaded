import LikeButton from '@/components/like-button';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            // likes: true, // 데이터 분리로 인해 삭제(14.3)
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

//🔥 이 부분이  코드설명이 필요한 부분
const getCachedPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  // ⚠️ getSession 과 nextCache 를 같이 쓰면 안됨
  //   const session = await getSession(); // 주석처리
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId,
      },
    },
  });

  // const likeCount => url에서 얻은 id를 가진 post에 대해 생성된 like 개수를 알려거다.
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

//🔥 이 부분이  코드설명이 필요한 부분
async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cacheOperation = nextCache(getLikeStatus, ['product-like-status'], {
    tags: [`like-status-${postId}`],
    //   revalidate: 60,
  });
  return cacheOperation(postId, userId!);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);

  if (!post) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  return (
    <div className='p-5 text-white'>
      <div className='flex items-center gap-2 mb-2'>
        {post.user.avatar ? (
          <Image
            width={28}
            height={28}
            className='size-7 rounded-full'
            src={post.user.avatar}
            alt={post.user.username}
          />
        ) : (
          <div className='size-7 rounded-full bg-gray-400 flex items-center justify-center text-xs'>
            {post.user.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <span className='text-sm font-semibold'>{post.user.username}</span>
          <div className='text-xs'>
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className='text-lg font-semibold'>{post.title}</h2>
      <p className='mb-5'>{post.description}</p>
      <div className='flex flex-col gap-5 items-start'>
        <div className='flex items-center gap-2 text-neutral-400 text-sm'>
          <EyeIcon className='size-5' />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
    </div>
  );
}
