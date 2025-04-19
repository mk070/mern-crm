// routes/posts.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
const instagramController = require('../controllers/instagramController');

// Publish post immediately to multiple platforms
router.post('/publish', auth, upload.single('media'), async (req, res) => {
    try {
      console.log('=== PUBLISH REQUEST START ===');
      console.log('Request body keys:', Object.keys(req.body));
      console.log('Request file:', req.file ? `${req.file.mimetype} ${req.file.size} bytes` : 'No file');
      
      const { content } = req.body;
      const userId = req.user.id;
      
      // Get platforms from request body
      let platforms = req.body.platforms;
      console.log('Raw platforms value:', platforms);
      console.log('Raw platforms type:', typeof platforms);
      
      let parsedPlatforms = [];
      
      // Don't try to parse if platforms is already the string "instagram"
      if (platforms === "instagram") {
        parsedPlatforms = ["instagram"];
      }
      // If it's an array, use it directly
      else if (Array.isArray(platforms)) {
        parsedPlatforms = platforms;
      }
      // If it looks like a JSON string, try to parse it
      else if (typeof platforms === 'string' && (platforms.startsWith('[') || platforms.startsWith('{'))) {
        try {
          parsedPlatforms = JSON.parse(platforms);
          // If it parsed to a string, put it in an array
          if (typeof parsedPlatforms === 'string') {
            parsedPlatforms = [parsedPlatforms];
          }
        } catch (parseError) {
          console.error('Error parsing platforms:', parseError);
          // If parsing fails, treat it as a single platform
          parsedPlatforms = [platforms];
        }
      }
      // If it's another non-empty value, use it as a single platform
      else if (platforms) {
        parsedPlatforms = [platforms];
      }
      
      console.log('Parsed platforms:', parsedPlatforms);
      
      if (!Array.isArray(parsedPlatforms) || parsedPlatforms.length === 0) {
        return res.status(400).json({ message: 'At least one platform must be selected' });
      }
      
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }
      
      // Process for Instagram specifically
      const isInstagram = parsedPlatforms.includes('instagram');
      console.log('Is Instagram in platforms?', isInstagram);
      
      if (isInstagram) {
        console.log('Posting to Instagram...');
        // Instagram requires media
        if (!req.file) {
          return res.status(400).json({ message: 'Media file is required for Instagram posts' });
        }
        
        try {
          console.log('Preparing to call Instagram controller with:');
          console.log('- userId:', userId);
          console.log('- content length:', content ? content.length : 0);
          console.log('- mediaFile:', req.file ? `${req.file.mimetype} ${req.file.size} bytes` : 'Missing');
          
          // Call Instagram controller to publish the post
          const post = await instagramController.publishPost({
            userId,
            content,
            mediaFile: req.file
          });
          
          console.log('Instagram post successful, returning response');
          return res.status(200).json({
            message: 'Post published successfully to Instagram',
            post
          });
        } catch (instagramError) {
          console.error('Instagram publish error:', instagramError);
          console.error('Error stack:', instagramError.stack);
          return res.status(500).json({
            message: 'Failed to publish post to Instagram',
            error: instagramError.message
          });
        }
      } else {
        return res.status(400).json({ message: 'No supported platforms selected' });
      }
    } catch (error) {
      console.error('Post publish error:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        message: 'Failed to publish post',
        error: error.message
      });
    }
  });
  

// Schedule post for multiple platforms
router.post('/schedule', auth, upload.single('media'), async (req, res) => {
  try {
    const { content, platforms, scheduledDate, scheduledTime } = req.body;
    const userId = req.user.id;
    
    // Parse platforms if it's a string (from FormData)
    const parsedPlatforms = typeof platforms === 'string' ? JSON.parse(platforms) : platforms;
    
    if (!Array.isArray(parsedPlatforms) || parsedPlatforms.length === 0) {
      return res.status(400).json({ message: 'At least one platform must be selected' });
    }
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({ message: 'Scheduled date and time are required' });
    }
    
    // Process for Instagram specifically (focusing on Instagram as requested)
    if (parsedPlatforms.includes('instagram')) {
      // Instagram requires media
      if (!req.file) {
        return res.status(400).json({ message: 'Media file is required for Instagram posts' });
      }
      
      // Create a modified req object for the Instagram controller
      const instagramReq = {
        ...req,
        body: { content, scheduledDate, scheduledTime }
      };
      
      // Create a mock response to capture the Instagram controller's response
      const instagramRes = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.data = data;
          return this;
        }
      };
      
      // Call Instagram schedule controller
      await instagramController.schedulePost(instagramReq, instagramRes);
      
      // Check if Instagram schedule was successful
      if (instagramRes.statusCode >= 400) {
        return res.status(instagramRes.statusCode).json(instagramRes.data);
      }
      
      return res.status(200).json({
        message: 'Post scheduled successfully for Instagram',
        post: instagramRes.data.post
      });
    } else {
      return res.status(400).json({ message: 'No supported platforms selected' });
    }
  } catch (error) {
    console.error('Post schedule error:', error);
    return res.status(500).json({
      message: 'Failed to schedule post',
      error: error.message
    });
  }
});

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, platform } = req.query;
    
    const query = { userId };
    
    if (status) {
      query.status = status;
    }
    
    if (platform) {
      query.platforms = platform;
    }
    
    const posts = await Post.find(query).sort({ createdAt: -1 });
    
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    return res.status(500).json({
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
});

// Get scheduled posts
router.get('/scheduled', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { platform } = req.query;
    
    const query = {
      userId,
      status: 'scheduled'
    };
    
    if (platform) {
      query.platforms = platform;
    }
    
    const posts = await Post.find(query).sort({ scheduledFor: 1 });
    
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Get scheduled posts error:', error);
    return res.status(500).json({
      message: 'Failed to fetch scheduled posts',
      error: error.message
    });
  }
});

module.exports = router;