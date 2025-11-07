export default function (content: string) {
  const readTime = Math.ceil(content.split(" ").length / 260);
  return readTime + " minutes read";
}
