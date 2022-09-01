export const extract_data = (data: string, start: string, end: string) => {
  const startPos = data.indexOf(start) + start.length;
  return data.substring(startPos, data.indexOf(end, startPos));
};
