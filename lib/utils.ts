export function formatToTimeAgo(date: string): string {
  //
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);
  /// formatter 기본적인 기능 : -3일로 값이 나오는 부분을 3일 전으로 바꿔주는 기능을 해준다.
  const formatter = new Intl.RelativeTimeFormat('ko');
  return formatter.format(diff, 'days');
}

export function formatToWon(price: number): string {
  return price.toLocaleString('ko-KR');
}
