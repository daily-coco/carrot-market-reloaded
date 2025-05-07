'use client';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import { dislikePost, likePost } from '@/app/posts/[id]/actions';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => {
      return {
        isLiked: !previousState.isLiked,
        likeCount: previousState.isLiked
          ? previousState.likeCount - 1
          : previousState.likeCount + 1,
      };
    }
  );
  // useOptimistic()
  // 첫번째 파라미터 : mutation이 발생하기 전에 유저에게 보여주고 싶은 데이터
  // 유저에게 보여줘야할 initial data는? => 서버에서 보낸 데이터 (isLiked, likeCount )
  // 두번째 파라미터 : reducer, reducer는 기본적으로 첫번째 파라미터의 데이터를 수정하는 것이다. ( 여기서는 { isLiked, likeCount }이 내용이 해당된다.)
  // reducer는 두 개의 파라미터와 함께 호출되는 함수

  // 버튼 클릭 시 server action 호출할 수 있도록 onClick handler 연결
  const onClick = async () => {
    // 모든게 시작 전에 reduceFn을 먼저 호출시켜준다.
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${
        state.isLiked
          ? 'bg-orange-500 text-white border-orange-500'
          : 'hover:bg-neutral-800'
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className='size-5' />
      ) : (
        <OutlineHandThumbUpIcon className='size-5' />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}
