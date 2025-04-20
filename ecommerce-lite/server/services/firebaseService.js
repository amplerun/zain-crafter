const { bucket } = require('../config/firebase');

exports.uploadToFirebase = async (file, folder = '') => {
  try {
    const fileName = `${folder}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    // Get public URL
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Far future date
    });
    
    return url;
  } catch (error) {
    console.error('Error uploading to Firebase:', error);
    throw error;
  }
};

exports.deleteFromFirebase = async (fileUrl) => {
  try {
    const fileName = fileUrl.split('/').pop().split('?')[0];
    await bucket.file(fileName).delete();
    return true;
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    throw error;
  }
};
