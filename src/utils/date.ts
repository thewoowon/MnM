export function formatKoreanDateTime(time: string) {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${time}:00`;
  // "HH:mm" 형태의 time을 그대로 붙임
}
