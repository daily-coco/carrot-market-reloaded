'use client';
import { useEffect, useRef, useState } from 'react';
import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { getMoreProducts } from '@/app/(tabs)/products/actions';

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        //console.log(entries[0].isIntersecting);
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      //user가 page를 떠날 때
      observer.disconnect();
    };
  }, [page]);
  // page가 변경되면 바로 여기에 있는 useEffect 코드가 다시 실행되기 때문에

  return (
    <div className='p-5 flex flex-col gap-5'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          style={{ marginTop: `${page + 1 * 300}vh` }}
          className='mt-[300vh] mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95'
        >
          {isLoading ? '로딩 중' : 'Load more'}
        </span>
      ) : null}
    </div>
  );
}
