const getDefaultAvatar = (name) => {
  const formattedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${formattedName}&background=random&color=fff`;
};

module.exports = { getDefaultAvatar };
