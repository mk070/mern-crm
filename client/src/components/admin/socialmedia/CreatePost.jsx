import React, { useState, useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Instagram,
  Twitter,
  Linkedin,
  X,
  Image as ImageIcon,
  Calendar,
  Clock,
  Sparkles,
  Send,
  Link as LinkIcon,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../../api/axios'; // Adjust the import based on your project structure
const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    connected: true,
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    mediaRequired: true
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    connected: true,
    color: 'bg-[#1DA1F2]',
    mediaRequired: false
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    connected: true,
    color: 'bg-[#0A66C2]',
    mediaRequired: false
  }
];

export default function CreatePost() {
  const navigate = useNavigate();
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [postContent, setPostContent] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [media, setMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch connected accounts on component mount
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const response = await api.get('/api/oauth/connections');
        console.log('Connected accounts:', response);
        setConnectedAccounts(response.data.connections);
      } catch (error) {
        console.error('Error fetching connected accounts:', error);
        toast.error('Failed to load connected accounts');
      }
    };
    
    fetchConnectedAccounts();
  }, []);

  const handlePlatformToggle = (platformId) => {
    const newSelected = new Set(selectedPlatforms);
    console.log('Toggling platform:', platformId);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      // Check if platform is connected
      const isConnected = connectedAccounts.some(
        connection => connection.platform === platformId
      );
      
      console.log('Is connected:', isConnected);
      // If not connected, show error message
      if (!isConnected) {
        toast.error(`Please connect your ${platformId} account first`);
        return;
      }
      
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
  };


  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      setMedia({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
      });
    }
  };

  const handleRemoveMedia = () => {
    if (media?.preview) {
      URL.revokeObjectURL(media.preview);
    }
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateAICaption = async () => {
    setIsGeneratingCaption(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiCaption = "🌟 Experience innovation at its finest! Join us on this exciting journey as we transform ideas into reality. #Innovation #Technology #Future";
      setPostContent(aiCaption);
      toast.success('AI caption generated!');
    } catch (error) {
      toast.error('Failed to generate caption. Please try again.');
    } finally {
      setIsGeneratingCaption(false);
    }
  };


  // const generateAICaption = async () => {
  //   setIsGeneratingCaption(true);
  //   try {
  //     const response = await axios.post('/api/ai/generate-caption', {
  //       mediaType: media?.type || 'general',
  //       platforms: Array.from(selectedPlatforms)
  //     });
      
  //     setPostContent(response.data.caption);
  //     toast.success('AI caption generated!');
  //   } catch (error) {
  //     console.error('AI caption error:', error);
  //     toast.error('Failed to generate caption. Please try again.');
  //   } finally {
  //     setIsGeneratingCaption(false);
  //   }
  // };


  const handleSubmit = async (postType) => {
    if (selectedPlatforms.size === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (!postContent.trim()) {
      toast.error('Please enter your post content');
      return;
    }

    // Check if Instagram is selected but no media is uploaded
    if (selectedPlatforms.has('instagram') && !media) {
      toast.error('Instagram posts require media');
      return;
    }

    if (postType === 'schedule' && (!scheduledDate || !scheduledTime)) {
      toast.error('Please select both date and time for scheduled post');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', postContent);
      formData.append('platforms', JSON.stringify(Array.from(selectedPlatforms)));
      
      if (media) {
        formData.append('media', media.file);
      }
      
      if (postType === 'schedule') {
        formData.append('scheduledDate', scheduledDate);
        formData.append('scheduledTime', scheduledTime);
      }
      
      // Different endpoints based on action type
      const endpoint = postType === 'now' ? '/api/posts/publish' : '/api/posts/schedule';
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success(
        postType === 'now'
          ? 'Post published successfully!'
          : 'Post scheduled successfully!'
      );
      
      // Navigate to appropriate page based on action
      navigate(postType === 'now' ? '/socialmedia/posts' : '/socialmedia/scheduled');
    } catch (error) {
      console.error('Post submission error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to process your post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Toaster position="top-right" />

    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-neutral-surface rounded-xl shadow-sm border border-neutral-border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-neutral-text-primary font-jakarta">
              Edit post
            </h1>
            <button
              onClick={() => navigate('/socialmedia/connect')}
              className="flex items-center text-sm text-primary hover:text-primary-hover transition-colors"
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              Connect profiles
            </button>
          </div>

          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-text-primary font-jakarta mb-2">
              Publish to
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.id)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    selectedPlatforms.has(platform.id)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-neutral-border text-neutral-text-secondary hover:border-primary/20'
                  }`}
                >
                  <platform.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{platform.name}</span>
                  {selectedPlatforms.has(platform.id) && (
                    <X
                      className="h-4 w-4 ml-2 hover:text-status-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlatformToggle(platform.id);
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <div className="relative">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-[120px] p-4 rounded-xl border border-neutral-border bg-neutral-bg placeholder-neutral-text-secondary focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 font-inter resize-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-3">
                <span className="text-sm text-neutral-text-secondary">
                  {postContent.length}/280
                </span>
                <button
                  onClick={generateAICaption}
                  disabled={isGeneratingCaption}
                  className="flex items-center px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  {isGeneratingCaption ? 'Generating...' : 'AI Assist'}
                </button>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            {media ? (
              <div className="relative rounded-xl overflow-hidden border border-neutral-border">
                {media.type === 'image' ? (
                  <img
                    src={media.preview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <video
                    src={media.preview}
                    className="w-full h-64 object-cover"
                    controls
                  />
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-2 bg-neutral-surface/80 rounded-lg hover:bg-neutral-surface transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-text-secondary" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center rounded-xl border-2 border-dashed border-neutral-border px-6 py-10">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-neutral-text-secondary" />
                  <div className="mt-4 flex text-sm leading-6 text-neutral-text-secondary">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-text-secondary">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-text-primary font-jakarta mb-2">
              Pick date and time
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-text-secondary" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-border bg-neutral-bg focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-text-secondary" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-border bg-neutral-bg focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => handleSubmit('schedule')}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 rounded-xl text-neutral-text-secondary bg-neutral-bg hover:text-neutral-text-primary hover:bg-neutral-border/50 transition-all duration-200 text-sm font-medium"
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule for later
            </button>
            <button
              onClick={() => handleSubmit('now')}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 rounded-xl text-white bg-primary hover:bg-primary-hover transition-all duration-200 text-sm font-medium disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}