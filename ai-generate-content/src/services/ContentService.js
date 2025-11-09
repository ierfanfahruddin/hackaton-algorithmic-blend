const ContentGeneratorAgent = require('../agents/ContentGeneratorAgent');
const ImageGeneratorAgent = require('../agents/ImageGeneratorAgent');

class ContentService {
  constructor() {
    this.contentAgent = new ContentGeneratorAgent();
    this.imageAgent = new ImageGeneratorAgent();
  }

  async generateSocialMediaContent(topic, platform) {
    try {
      // Generate text content
      const textContent = await this.contentAgent.generateSocialMediaPost(topic, platform);

      // Generate matching image
      const imagePrompt = `Create an image that matches this social media post: ${textContent}`;
      const image = await this.imageAgent.generateSocialMediaImage(imagePrompt, platform);

      return {
        success: true,
        content: {
          text: textContent,
          image: image,
          platform: platform,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating social media content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateBlogContent(topic, options = {}) {
    try {
      const { wordCount = 500, includeImage = true } = options;

      // Generate blog post
      const blogContent = await this.contentAgent.generateBlogPost(topic, wordCount);

      let imageUrl = null;
      if (includeImage) {
        // Generate featured image
        const imagePrompt = `Create a featured image for a blog post about: ${topic}`;
        imageUrl = await this.imageAgent.generateImage(imagePrompt, 'professional');
      }

      return {
        success: true,
        content: {
          blog: blogContent,
          featuredImage: imageUrl,
          topic: topic,
          wordCount: wordCount,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating blog content:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = ContentService;