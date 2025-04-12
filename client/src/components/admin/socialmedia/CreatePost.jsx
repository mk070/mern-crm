import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Instagram,
  Twitter,
  Linkedin,
  Upload,
  Calendar,
  Sparkles,
  Clock,
  Send,
  Image as ImageIcon,
  X,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    connected: true,
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    mediaTypes: ['image', 'video'],
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    connected: true,
    color: 'bg-[#1DA1F2]',
    mediaTypes: ['image', 'video'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    connected: true,
    color: 'bg-[#0A66C2]',
    mediaTypes: ['image'],
  },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [postContent, setPostContent] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [postType, setPostType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [media, setMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlatformToggle = (platformId) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
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
  };

  const generateAICaption = async () => {
    setIsGeneratingCaption(true);
    try {
      // Simulated AI caption generation
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedPlatforms.size === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (!postContent.trim()) {
      toast.error('Please enter your post content');
      return;
    }

    if (postType === 'schedule' && (!scheduledDate || !scheduledTime)) {
      toast.error('Please select both date and time for scheduled post');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulated post submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        postType === 'now'
          ? 'Post published successfully!'
          : 'Post scheduled successfully!'
      );
      
      navigate('/socialmedia/scheduled');
    } catch (error) {
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-surface rounded-xl shadow-sm border border-neutral-border">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-neutral-text-primary font-jakarta mb-6">
              Create New Post
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-text-primary font-jakarta mb-4">
                  Select Platforms
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={`relative flex items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                        selectedPlatforms.has(platform.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-border hover:border-primary/20'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-lg ${platform.color}`}>
                          <platform.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-neutral-text-primary">
                          {platform.name}
                        </span>
                        {platform.connected ? (
                          <span className="text-xs text-status-success">Connected</span>
                        ) : (
                          <span className="text-xs text-status-error">Not Connected</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Content */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-neutral-text-primary font-jakarta">
                    Write Your Post
                  </label>
                  <button
                    type="button"
                    onClick={generateAICaption}
                    disabled={isGeneratingCaption}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGeneratingCaption ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={4}
                    className="block w-full rounded-xl border border-neutral-border bg-neutral-bg px-4 py-3 text-neutral-text-primary shadow-sm focus:border-primary focus:ring-primary font-inter"
                    placeholder="What's on your mind?"
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-neutral-text-secondary">
                    {postContent.length} / 280
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-text-primary font-jakarta mb-4">
                  Upload Media
                </label>
                <div className="relative">
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
                        type="button"
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
              </div>

              {/* Post Timing */}
              <div>
                <label className="block text-sm font-medium text-neutral-text-primary font-jakarta mb-4">
                  When to Post
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-primary"
                        name="postType"
                        value="now"
                        checked={postType === 'now'}
                        onChange={(e) => setPostType(e.target.value)}
                      />
                      <span className="ml-2 text-neutral-text-primary">Post Now</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-primary"
                        name="postType"
                        value="schedule"
                        checked={postType === 'schedule'}
                        onChange={(e) => setPostType(e.target.value)}
                      />
                      <span className="ml-2 text-neutral-text-primary">Schedule Post</span>
                    </label>
                  </div>

                  {postType === 'schedule' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="block w-full rounded-xl border border-neutral-border bg-neutral-bg px-4 py-2 text-neutral-text-primary shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="block w-full rounded-xl border border-neutral-border bg-neutral-bg px-4 py-2 text-neutral-text-primary shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary transition-all duration-200 shadow-lg shadow-primary/25 font-inter disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      {postType === 'now' ? 'Post Now' : 'Schedule Post'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}