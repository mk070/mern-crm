// controllers/instagramController.js
const fs = require('fs').promises;
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const OAuthToken = require('../models/OAuthToken');
const Post = require('../models/Post');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3
const uploadFileToS3 = async (file) => {
  const fileContent = await fs.readFile(file.path);
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);
  
  // Clean up local file after upload
  await fs.unlink(file.path);
  
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
};

// Publish post to Instagram
exports.publishPost = async ({ userId, content, mediaFile }) => {
    console.log('=== INSTAGRAM CONTROLLER START ===');
    try {
      console.log('Instagram controller received:');
      console.log('- userId:', userId);
      console.log('- content excerpt:', content ? content.substring(0, 30) + '...' : 'No content');
      console.log('- mediaFile:', mediaFile ? `${mediaFile.mimetype} ${mediaFile.size} bytes` : 'No media file');
      
      // Check if Instagram account is connected
      console.log('Finding Instagram account for user:', userId);
      const igAccount = await OAuthToken.findOne({ 
        userId, 
        platform: 'instagram'
      });
  
      console.log('Instagram account found?', !!igAccount);
      if (!igAccount) {
        throw new Error('Instagram account not connected');
      }
  
      // Check if media exists (required for Instagram)
      if (!mediaFile) {
        throw new Error('Media file is required for Instagram posts');
      }
  
      // Upload to S3
      console.log('Uploading file to S3...');
      const mediaUrl = await uploadFileToS3(mediaFile);
      console.log('Media uploaded to S3:', mediaUrl);
  
      try {
        // Post to Instagram using Graph API
        console.log('Calling Instagram API...');
        
        const apiRequestData = {
          image_url: mediaUrl,
          caption: content,
          access_token: igAccount.accessToken
        };
        
        console.log('Instagram API request data structure:', Object.keys(apiRequestData));
        
        const containerResponse = await axios.post(
          `https://graph.instagram.com/v22.0/${igAccount.platformUserId}/media`,
          apiRequestData,
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Container creation successful:', containerResponse.data);
        const mediaId = containerResponse.data.id;
  
        // Publish the container
        console.log('Publishing container with ID:', mediaId);
        const publishResponse = await axios.post(
          `https://graph.instagram.com/v22.0/${igAccount.platformUserId}/media_publish`,
          {
            creation_id: mediaId,
            access_token: igAccount.accessToken
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        console.log('Publish successful:', publishResponse.data);
  
        // Create the post document - IMPORTANT - this is where we store platforms as an array
        console.log('Creating post document in database');
        const post = new Post({
          userId,
          content,
          mediaUrl,
          platforms: ['instagram'], // Hard-coded array, not parsed from input
          status: 'published',
          publishedAt: new Date(),
          platformPostId: publishResponse.data.id
        });
  
        console.log('Saving post to database');
        await post.save();
        console.log('Post saved successfully with ID:', post._id);
  
        return post;
      } catch (igError) {
        console.error('Instagram API error:', igError);
        console.error('Error response data:', igError.response?.data);
        console.error('Error stack:', igError.stack);
        
        if (igError.response?.data?.error?.type === 'OAuthException') {
          throw new Error('Instagram authentication failed. Please reconnect your account.');
        }
        
        throw igError;
      }
    } catch (error) {
      console.error('Instagram controller encountered an error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  };
  
  
// Helper function for token refresh if needed
async function refreshInstagramToken(refreshToken) {
try {
    const response = await axios.post('https://graph.instagram.com/refresh_access_token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
    });
    
    return {
    accessToken: response.data.access_token,
    expiresAt: new Date(Date.now() + (response.data.expires_in * 1000)),
    refreshToken: response.data.refresh_token || refreshToken
    };
} catch (error) {
    console.error('Failed to refresh Instagram token:', error);
    throw new Error('Failed to refresh authentication. Please reconnect your account.');
}
}

// Schedule a post for later
exports.schedulePost = async (req, res) => {
  try {
    const { content, scheduledDate, scheduledTime } = req.body;
    const userId = req.user.id;

    // Check if Instagram account is connected
    const igAccount = await OAuthToken.findOne({ 
      userId, 
      platform: 'instagram'
    });

    if (!igAccount) {
      return res.status(400).json({ message: 'Instagram account not connected' });
    }

    // Check if media exists (required for Instagram)
    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required for Instagram posts' });
    }

    // Validate date and time
    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({ message: 'Scheduled date and time are required' });
    }

    // Combine date and time to create scheduled datetime
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    // Ensure scheduled time is in the future
    if (scheduledDateTime <= new Date()) {
      return res.status(400).json({ message: 'Scheduled time must be in the future' });
    }

    // Upload to S3
    const mediaUrl = await uploadFileToS3(req.file);

    // Save the scheduled post to our database
    const post = new Post({
      userId,
      content,
      mediaUrl,
      platforms: ['instagram'],
      status: 'scheduled',
      scheduledFor: scheduledDateTime
    });

    await post.save();

    return res.status(200).json({ 
      message: 'Post scheduled successfully for Instagram',
      post
    });
  } catch (error) {
    console.error('Instagram schedule error:', error.message);
    return res.status(500).json({ 
      message: 'Failed to schedule post',
      error: error.message
    });
  }
};

// Get Instagram account details
exports.getAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const igAccount = await OAuthToken.findOne({ 
      userId, 
      platform: 'instagram'
    });
    
    if (!igAccount) {
      return res.status(404).json({ message: 'Instagram account not connected' });
    }
    
    // Get account details from Instagram API
    try {
      const response = await axios.get(
        `https://graph.instagram.com/v22.0/${igAccount.platformUserId}`,
        {
          params: {
            fields: 'id,username,name,profile_picture_url',
            access_token: igAccount.accessToken
          }
        }
      );
      
      return res.status(200).json({
        account: {
          id: igAccount.platformUserId,
          username: igAccount.platformUsername,
          profilePicture: response.data.profile_picture_url,
          name: response.data.name,
          connectedAt: igAccount.createdAt,
          expiresAt: igAccount.expiresAt
        }
      });
    } catch (igError) {
      console.error('Instagram API error:', igError.response?.data || igError.message);
      
      // Check if token expired
      if (igError.response?.data?.error?.type === 'OAuthException') {
        return res.status(401).json({ 
          message: 'Instagram authentication failed. Please reconnect your account.',
          error: igError.response.data.error.message
        });
      }
      
      throw igError;
    }
  } catch (error) {
    console.error('Get Instagram account error:', error.message);
    return res.status(500).json({
      message: 'Failed to get Instagram account details',
      error: error.message
    });
  }
};

// Disconnect Instagram account
exports.disconnectAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const igAccount = await OAuthToken.findOne({ 
      userId, 
      platform: 'instagram'
    });
    
    if (!igAccount) {
      return res.status(404).json({ message: 'Instagram account not connected' });
    }
    
    // Revoke Instagram access token
    try {
      await axios.delete(
        'https://graph.instagram.com/v22.0/me/permissions',
        {
          params: {
            access_token: igAccount.accessToken
          }
        }
      );
    } catch (igError) {
      console.warn('Instagram token revocation error:', igError.message);
      // Continue with disconnection even if token revocation fails
    }
    
    // Delete from our database
    await OAuthToken.deleteOne({ _id: igAccount._id });
    
    return res.status(200).json({ message: 'Instagram account disconnected successfully' });
  } catch (error) {
    console.error('Disconnect Instagram error:', error.message);
    return res.status(500).json({
      message: 'Failed to disconnect Instagram account',
      error: error.message
    });
  }
};