const readline = require('readline');
const ContentService = require('./services/ContentService');
const ContentGeneratorAgent = require('./agents/ContentGeneratorAgent');
const ImageGeneratorAgent = require('./agents/ImageGeneratorAgent');
const PostReceiverAgent = require('./agents/PostReceiverAgent');

class AIContentBot {
  constructor() {
    this.contentService = new ContentService();
    this.contentGenerator = new ContentGeneratorAgent();
    this.imageGenerator = new ImageGeneratorAgent();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.log('Marketing Bot siap membantu! Ketik "exit" untuk keluar.');
    console.log('Contoh perintah:');
    console.log('- "buat konten instagram tentang kopi"');
    console.log('- "buat gambar untuk facebook tentang makanan sehat"');
    console.log('- "buat artikel blog tentang digital marketing"');

    this.askQuestion();
  }

  async askQuestion() {
    this.rl.question('🤖 Apa yang bisa saya bantu? ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        this.rl.close();
        return;
      }

      try {
        await this.processCommand(input);
      } catch (error) {
        console.error('❌ Terjadi kesalahan:', error.message);
      }

      this.askQuestion();
    });
  }

  async handleCommand(command, options = {}) {
    const { type, topic, platform } = command;

    switch (type.toLowerCase()) {
      case 'social':
        return this.contentService.generateSocialMediaContent(topic, platform);
      
      case 'blog':
        return this.contentService.generateBlogContent(topic, options);
      
      default:
        return {
          success: false,
          error: 'Invalid command type. Please use "social" or "blog".'
        };
    }
  }

  async processCommand(input) {
    try {
      const command = this.parsePrompt(input.toLowerCase());
      
      console.log('⏳ Sedang memproses permintaan Anda...');
      const result = await this.handleCommand(command);
      
      console.log('\n✅ Hasil:');
      console.log('------------------------');
      if (result && result.success) {
        console.log(JSON.stringify(result.content, null, 2));
      } else {
        console.log('Error:', result?.error || 'Tidak ada hasil (response undefined)');
      }
      console.log('------------------------');
      
      return result;
    } catch (error) {
      console.error('❌ Error:', error.message);
      return {
        success: false,
        error: 'Gagal memproses permintaan Anda. Silakan coba lagi.'
      };
    }
  }

  parsePrompt(prompt) {
    // Simple prompt parser
    const words = prompt.toLowerCase().split(' ');
    
    if (words.includes('social') || words.includes('post')) {
      return {
        type: 'social',
        topic: prompt.replace(/social|post/gi, '').trim(),
        platform: words.includes('instagram') ? 'instagram' : 
                 words.includes('facebook') ? 'facebook' : 
                 'generic'
      };
    }
    
    if (words.includes('blog') || words.includes('article')) {
      return {
        type: 'blog',
        topic: prompt.replace(/blog|article/gi, '').trim(),
        options: {
          wordCount: this.extractWordCount(prompt),
          includeImage: !words.includes('noimage')
        }
      };
    }

    // Default to social media post if type is unclear
    return {
      type: 'social',
      topic: prompt,
      platform: 'generic'
    };
  }

  extractWordCount(prompt) {
    const match = prompt.match(/(\d+)\s*words/i);
    return match ? parseInt(match[1]) : 500;
  }
}

module.exports = AIContentBot;

// If this file is run directly, start the interactive bot.
if (require.main === module) {
  const bot = new AIContentBot();
  bot.start();

  // Start PostReceiverAgent to accept incoming posts from n8n or other sources.
  try {
    const postAgent = new PostReceiverAgent();
    postAgent.start();
  } catch (err) {
    console.error('Failed to start PostReceiverAgent:', err);
  }
}