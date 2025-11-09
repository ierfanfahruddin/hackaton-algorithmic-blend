const { VertexAI } = require('@google-cloud/vertexai');
const path = require('path');

class ImageGeneratorAgent {
  constructor() {
    this.vertexai = new VertexAI({
      project: 'apt-tracker-464013-v9',
      location: 'us-central1',
      keyFilename: path.join(__dirname, '../config/google-cloud-key.json')
    });

    this.generativeModel = this.vertexai.preview.getGenerativeModel({
      model: 'gemini-pro-vision',
      generation_config: {
        temperature: 0.4,
        top_p: 1,
        top_k: 32,
      },
    });
  }

  async generateImage(prompt, style = 'realistic') {
    try {
      const imagePrompt = `Create a ${style} image of ${prompt}. 
      Make it visually appealing and suitable for social media.`;

      const request = {
        contents: [{
          role: 'user',
          parts: [{ text: imagePrompt }]
        }],
      };

      const response = await this.generativeModel.generateContent(request);
      const result = await response.response;
      
      return result.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating image:', error.message || error);

      const isForbidden = (error && (error.code === 403 || (error.message||'').toLowerCase().includes('forbidden') || (error.message||'').includes('403')));
      if (isForbidden && process.env.USE_FALLBACK === 'true') {
        console.warn('Vertex AI returned 403 Forbidden — returning fallback demo image URL.');
        // Return a public placeholder image so the CLI can continue.
        return `https://placehold.co/800x600?text=Demo+Image+for+${encodeURIComponent(prompt)}`;
      }

      throw error;
    }
  }

  async generateSocialMediaImage(prompt, platform, dimensions) {
    const styleGuide = {
      instagram: { style: 'vibrant and eye-catching', ratio: '1:1' },
      facebook: { style: 'clean and professional', ratio: '16:9' },
      twitter: { style: 'bold and attention-grabbing', ratio: '16:9' },
    };

    const style = styleGuide[platform]?.style || 'professional';
    const aspectRatio = dimensions || styleGuide[platform]?.ratio || '1:1';

    return this.generateImage(prompt, style, aspectRatio);
  }
}

module.exports = ImageGeneratorAgent;