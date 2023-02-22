const useUpdateUser = () => {
  const addFriendFunc = async (userId, friend) => {
    await axios.put(`http://localhost:5000/api/user/${friend._id}/add`, {
      userId,
    });
    await axios.post('http://localhost:5000/api/talkRoom/create', {
      talkRoomIconImage: friend.iconImage,
      talkRoomName: friend.username,
      members: [userId, friend._id],
    });
  };

  return { addFriendFunc };
};

export default useUpdateUser;
