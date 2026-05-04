export const generateInitials = (fullname) => {
  if (!fullname) return "";

  const words = fullname.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "";

  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";

  return (first + last).toUpperCase();
};
