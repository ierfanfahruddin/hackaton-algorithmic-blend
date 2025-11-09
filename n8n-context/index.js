const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const { ChatOpenAI } = require('@langchain/openai');
const { AgentExecutor } = require('langchain/agents');
const { createOpenAIFunctionsAgent } = require('@langchain/openai/agents');
const { DynamicTool } = require('@langchain/core/tools');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const config = require('./config');

const app = express();
const port = 3000;

app.use(express.json());

// ----------------- LANGCHAIN SETUP -----------------
const model = new ChatOpenAI({ openAIApiKey: config.OPENAI_API_KEY, modelName: 'gpt-4.1-mini' });

// ----------------- LANGCHAIN TOOLS -----------------

/**
 * LangChain Tool for writing content.
 */
const contentWriterTool = new DynamicTool({
    name: 'ContentWriterAgent',
    description: 'Creates engaging social media post text based on topic, target audience, and brand voice. Input should be a string describing the content goal.',
    func: async (input) => {
        const writerPrompt = `
            CRITICAL RULE: You MUST ONLY create content about accessories (jewelry, bags, watches, fashion accessories, belts, scarves, sunglasses, etc.). If the topic is not about accessories, refuse to create content and return an error message instead.
            You are a Social Media Content Writer specialized in creating engaging posts for Instagram and Facebook.
            Your task is to:
            1. Analyze the provided topic, target audience, and brand voice.
            2. Create compelling post text that:
               - Captures attention in the first line
               - Includes relevant hashtags (3-5 hashtags)
               - Has a clear call-to-action
               - Matches the brand voice
               - Is optimized for both Instagram and Facebook (under 2200 characters)
            3. Return ONLY the post text, no additional explanation.
            Format the post professionally with proper line breaks and emoji where appropriate.
            Input: ${input}
        `;
        const response = await model.invoke(writerPrompt);
        return response.content;
    }
});

/**
 * LangChain Tool for generating images.
 */
const imageGeneratorTool = new DynamicTool({
    name: 'ImageGeneratorAgent',
    description: 'Generates images using DALL-E based on the content topic. Input should be a string describing the image goal.',
    func: async (input) => {
        const imagePrompt = `
            You are an Image Generation Specialist that creates visual content for social media.
            Your task is to:
            1. Analyze the provided topic and context.
            2. Create a detailed, creative DALL-E prompt that:
               - Describes the visual style (modern, professional, vibrant, etc.)
               - Includes key elements related to the topic
               - Specifies composition and mood
               - Is optimized for social media (square format works best)
            3. Return ONLY the DALL-E prompt, no additional text.
            Input: ${input}
        `;
        const response = await model.invoke(imagePrompt);
        const dallePrompt = response.content;

        const imageResponse = await axios.post('https://api.openai.com/v1/images/generations', {
            model: 'dall-e-2',
            prompt: dallePrompt,
            size: '1024x1024'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            }
        });

        return imageResponse.data.data[0].url;
    }
});

const tools = [contentWriterTool, imageGeneratorTool];

// ----------------- SERVICES -----------------

/**
 * Fetches comments from a Facebook page.
 */
async function getFacebookComments() {
    try {
        const response = await axios.get(`https://graph.facebook.com/v20.0/${config.FACEBOOK_PAGE_ID}/posts`, {
            params: {
                access_token: config.FACEBOOK_ACCESS_TOKEN,
                fields: 'comments{message},message',
                limit: 10
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Facebook comments:', error.response ? error.response.data : error.message);
        return null;
    }
}

/**
 * Fetches trending topics from Google Trends via SerpApi.
 */
async function getTrendingTopics() {
    try {
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                engine: 'google_trends_trending_now',
                api_key: config.SERPAPI_API_KEY,
                geo: 'ID'
            }
        });
        return response.data.trending_searches;
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        return null;
    }
}

/**
 * Selects a content topic based on Facebook comments and trending topics.
 */
async function selectTopic(comments, trends) {
    const prompt = `
        You are a Content Topic Selector Agent...
        CRITICAL: You MUST ONLY select topics related to accessories...
        ...
        IMPORTANT: Return ONLY the JSON object, no additional text.
        Facebook Comments: ${JSON.stringify(comments)}
        Trending Topics: ${JSON.stringify(trends)}
    `;
    const response = await model.invoke(prompt);
    return JSON.parse(response.content);
}

/**
 * Generates social media content (text and image) using a LangChain agent.
 */
async function generateContent(topic, audience, voice) {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a Marketing Orchestrator Agent that coordinates specialized AI agents to create social media content.
        Your task is to:
        1. Understand the user's request for content.
        2. Call the ContentWriterAgent tool to create engaging post text.
        3. Call the ImageGeneratorAgent tool to create a relevant image for the post.
        4. Return a JSON object with the following structure:
        {
          "postText": "the generated post text",
          "imageUrl": "the generated image URL"
        }
        IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"]
    ]);

    const agent = await createOpenAIFunctionsAgent({
        llm: model,
        tools,
        prompt,
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools,
    });

    const userInput = `Create content about: ${topic}. Target audience: ${audience}. Brand voice: ${voice}, Output in Indonesian`;

    const result = await agentExecutor.invoke({
        input: userInput,
    });

    return JSON.parse(result.output);
}

/**
 * Validates if the content is about accessories.
 */
function validateContent(postText) {
    const accessoryKeywords = [
        'jewelry', 'jewellery', 'bag', 'bags', 'watch', 'watches',
        'accessories', 'accessory', 'belt', 'belts', 'scarf', 'scarves',
        'sunglasses', 'necklace', 'necklaces', 'bracelet', 'bracelets',
        'ring', 'rings', 'earring', 'earrings', 'aksesoris', 'perhiasan',
        'tas', 'jam tangan', 'gelang', 'kalung', 'cincin', 'anting'
    ];
    const postTextLower = postText.toLowerCase();
    return accessoryKeywords.some(keyword => postTextLower.includes(keyword));
}

/**
 * Posts content to a Facebook page.
 */
async function postToFacebook(postText, imageUrl) {
    try {
        await axios.post(`https://graph.facebook.com/v20.0/${config.FACEBOOK_PAGE_ID}/feed`, {
            message: postText,
            link: imageUrl,
            access_token: config.FACEBOOK_ACCESS_TOKEN
        });
        console.log('Posted to Facebook successfully.');
    } catch (error) {
        console.error('Error posting to Facebook:', error.response ? error.response.data : error.message);
    }
}

/**
 * Sends the generated content to the dashboard.
 */
async function sendToDashboard(postText, imageUrl) {
    try {
        await axios.post(config.DASHBOARD_WEBHOOK_URL, {
            postText,
            imageUrl,
            timestamp: new Date().toISOString(),
            status: 'posted'
        });
        console.log('Sent to dashboard successfully.');
    } catch (error) {
        console.error('Error sending to dashboard:', error);
    }
}

// ----------------- API ENDPOINTS -----------------

app.post('/generate', async (req, res) => {
    const { topic, audience, voice } = req.body;
    if (!topic) {
        return res.status(400).send({ error: 'Topic is required' });
    }

    try {
        const { postText, imageUrl } = await generateContent(topic, audience || '', voice || '');
        const isValid = validateContent(postText);

        if (isValid) {
            // await postToFacebook(postText, imageUrl); // Disabled for safety
            // await sendToDashboard(postText, imageUrl); // Disabled for safety
            console.log('SUCCESS (Dry Run):', { postText, imageUrl });
            res.send({ postText, imageUrl, status: 'posted_dry_run' });
        } else {
            res.send({ postText, imageUrl, status: 'rejected', reason: 'Content is not about accessories' });
        }
    } catch (error) {
        console.error('Error in manual generation:', error);
        res.status(500).send({ error: 'Failed to generate content' });
    }
});

// ----------------- CRON JOB -----------------

cron.schedule('0 8 * * *', async () => {
    console.log('Running scheduled content generation...');
    const comments = await getFacebookComments();
    const trends = await getTrendingTopics();

    if (comments && trends) {
        try {
            const { selectedTopic, targetAudience, brandVoice } = await selectTopic(comments, trends);
            const { postText, imageUrl } = await generateContent(selectedTopic, targetAudience, brandVoice);
            const isValid = validateContent(postText);

            if (isValid) {
                // await postToFacebook(postText, imageUrl); // Disabled for safety
                // await sendToDashboard(postText, imageUrl); // Disabled for safety
                console.log('SUCCESS (Dry Run):', { postText, imageUrl });
                console.log('Scheduled post successful (Dry Run).');
            } else {
                console.log('Scheduled post rejected: Content is not about accessories.');
            }
        } catch (error) {
            console.error('Error in scheduled job:', error);
        }
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta"
});

// ----------------- SERVER -----------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});