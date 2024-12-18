const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { IgApiClient } = require('instagram-private-api');
const fs = require('fs').promises;
const Post = require('../models/Post');
const schedule = require('../scheduler');
const aicaption = require('../aimodel')

const ig = new IgApiClient();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const uploadFileToS3 = async (file) => {
    const fileContent = await fs.readFile(file.path);
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: fileContent,
        ContentType: file.mimetype,
        ACL: 'public-read', // This grants public read access to the uploaded object
    };
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
};


const createPost = async (req, res) => {
    const { caption, postType, scheduledTime,generatecaption } = req.body;
    const file = req.file;

    try {
        
        let fileUrl = null;

        // Check if scheduledTime is provided and validate it
    if (scheduledTime) {
        const scheduledDate = new Date(scheduledTime);

        if (scheduledDate <= new Date()) {
            return res.status(400).json({ message: 'Scheduled time must be in the future.' });
        }

        try {
            const fileUrl = await uploadFileToS3(file);
            console.log('File URL:', fileUrl);

            const newPost = new Post({
                caption,
                mediaUrl: fileUrl,
                postType,
                scheduledTime: scheduledDate, // Ensure scheduledTime is stored as Date object
            });
            await newPost.save();

            schedule.processScheduledPosts(); // Trigger the scheduled post processing

            return res.status(201).json(newPost);
        } catch (error) {
            console.error('Error uploading file to S3 or saving post:', error);
            return res.status(500).json({ message: 'Failed to upload file or save post.' });
        }
    }

        

        // Post immediately to Instagram
        await ig.state.generateDevice(process.env.IG_USERNAME);
        await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
        await ig.state.serialize;

    

        let result;
        const fileContent = await fs.readFile(file.path);
        if (postType === 'reel') {
            result = await ig.publish.video({
                video: fileContent,
                caption,
            });
        } else if (postType === 'story') {
            result = await ig.publish.story({
                file: fileContent,
                caption,
            });
        } else {
            result = await ig.publish.photo({
                file: fileContent,
                caption,
            });
        }

        console.log('Result:', result);
        return res.status(201).json({ message: 'Posted successfully to Instagram!', result });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(400).json({ message: error.message });
    } finally {
        if (file) {
            fs.unlink(file.path).catch(err => console.error('Failed to delete temporary file:', err));
        }
    }
};

const caption = async (req, res) => {
    const file = req.file;
    try {
        const fileUrl = await uploadFileToS3(file);
        console.log('File URL:', fileUrl);

        try {
            const generatedCaption = await aicaption.main(fileUrl);
            console.log("Caption: ", { generatedCaption });
            return res.status(201).json({ caption: generatedCaption });
        } catch (error) {
            console.error("Error generating caption:", error);
            return res.status(400).json({ message: error.message });
        }
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return res.status(400).json({ message: error.message });
    }
};



module.exports = {
    createPost,caption
};
