import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/main';
const useUploadImage = () => {
  const uploadImages = async (images, path) => {
    const imageNameArray = [];
    await Promise.all(
      images.map(async (image) => {
        const filePath = `images/${path}/${Date.now() + image.name}`;
        const imageRef = ref(storage, filePath);
        await uploadBytes(imageRef, image)
          .then(async (snapshot) => {
            console.log('Uploaded a image');
            await getDownloadURL(imageRef).then((url) => {
              imageNameArray.push(url);
            });
          })
          .catch((err) => console.log(err));
      })
    );

    return imageNameArray;
  };

  const uploadImage = async (image, path) => {
    const filePath = `images/${path}/${Date.now() + image.name}`;
    const imageRef = ref(storage, filePath);
    let imageURL;
    await uploadBytes(imageRef, image)
      .then(async (snapshot) => {
        console.log('upload a image');
        await getDownloadURL(imageRef).then((url) => {
          imageURL = url;
        });
      })
      .catch((err) => console.log(err));
    return imageURL;
  };
  return { uploadImages, uploadImage };
};

export default useUploadImage;
