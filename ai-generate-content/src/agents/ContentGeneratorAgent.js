const { VertexAI } = require('@google-cloud/vertexai');
const path = require('path');

class ContentGeneratorAgent {
  constructor() {
    this.vertexai = new VertexAI({
      project: 'apt-tracker-464013-v9',
      location: 'us-central1',
      keyFilename: path.join(__dirname, '../config/google-cloud-key.json')
    });

    this.generativeModel = this.vertexai.preview.getGenerativeModel({
      model: 'gemini-pro',
      generation_config: {
        max_output_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
      },
    });
  }

  async generateContent(prompt) {
    try {
      const request = {
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
      };

      const response = await this.generativeModel.generateContent(request);
      const result = await response.response;
      return result.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating content:', error.message || error);

      // If the error is a permissions / forbidden error and developer has
      // enabled fallback mode, return a safe dummy content so the CLI
      // doesn't crash and the developer can continue testing.
      const isForbidden = (error && (error.code === 403 || (error.message||'').toLowerCase().includes('forbidden') || (error.message||'').includes('403')));
      if (isForbidden && process.env.USE_FALLBACK === 'true') {
        console.warn('Vertex AI returned 403 Forbidden — returning fallback demo content.');
        return `Demo content for prompt: ${prompt}\n\n[This is fallback content because Vertex AI returned 403 Forbidden. Set up GCP credentials or disable USE_FALLBACK to call the real API.]`;
      }

      // Re-throw the original error when not in fallback mode so callers can
      // surface the real problem (API not enabled, wrong permissions, etc.).
      throw error;
    }
  }

  async generateSocialMediaPost(topic, platform) {
    const prompt = `Create a compelling ${platform} post about ${topic}. 
    Include appropriate hashtags and ensure the tone matches ${platform}'s style.
    Format the response with:
    - Caption
    - Hashtags
    - Call to action`;

    return this.generateContent(prompt);
  }

  async generateBlogPost(topic, wordCount = 500) {
    const prompt = `Write a detailed blog post about ${topic}. 
    The post should be approximately ${wordCount} words.
    Include:
    - Engaging title
    - Introduction
    - Main points with subheadings
    - Conclusion`;

    return this.generateContent(prompt);
  }
}

module.exports = ContentGeneratorAgent;