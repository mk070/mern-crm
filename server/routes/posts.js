// routes/posts.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
const instagramController = require('../controllers/instagramController');

// Publish post immediately to multiple platforms
router.post('/publish', auth, upload.single('media'), async (req, res) => {
  try {
    const { content, platforms } = req.body;
    const userId = req.user.id;
    
    // Parse platforms if it's a string (from FormData)
    const parsedPlatforms = typeof platforms === 'string' ? JSON.parse(platforms) : platforms;
    
    if (!Array.isArray(parsedPlatforms) || parsedPlatforms.length === 0) {
      return res.status(400).json({ message: 'At least one platform must be selected' });
    }
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
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
        body: { content }
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
      
      // Call Instagram publish controller
      await instagramController.publishPost(instagramReq, instagramRes);
      
      // Check if Instagram post was successful
      if (instagramRes.statusCode >= 400) {
        return res.status(instagramRes.statusCode).json(instagramRes.data);
      }
      
      return res.status(200).json({
        message: 'Post published successfully to Instagram',
        post: instagramRes.data.post
      });
    } else {
      return res.status(400).json({ message: 'No supported platforms selected' });
    }
  } catch (error) {
    console.error('Post publish error:', error);
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