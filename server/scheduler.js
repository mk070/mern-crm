const { IgApiClient } = require('instagram-private-api');
const Post = require('./models/Post');
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const ig = new IgApiClient();
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const sessionFilePath = path.join(__dirname, 'ig-session.json');

let loginAttempts = 0;
const maxLoginAttempts = 5;
const loginRetryDelay = 5 * 60 * 1000; // 5 minutes

const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

// const serializeSession = async () => {
//     const state = await ig.state.serialize();
//     delete state.constants; // Remove unnecessary constants to reduce file size
//     await writeFileAsync(sessionFilePath, JSON.stringify(state));
// };

// const deserializeSession = async () => {
//     if (await fileExists(sessionFilePath)) {
//         const sessionData = await readFileAsync(sessionFilePath, 'utf-8');
//         await ig.state.deserialize(JSON.parse(sessionData));
//     }
// };

// const loginToInstagram = async () => {
//     try {
//         await ig.state.generateDevice(process.env.IG_USERNAME);
//         await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

        
//     } catch (error) {
//         console.error('Error logging in to Instagram:', error);
//         throw error; // Rethrow the error to handle it in the calling function
//     }
// };

const downloadFileFromS3 = async (url) => {
    const key = url.split('.amazonaws.com/')[1];
    const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };
    const command = new GetObjectCommand(getObjectParams);
    const data = await s3Client.send(command);
    const chunks = [];
    for await (const chunk of data.Body) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

const deleteFileFromS3 = async (fileUrl) => {
    const key = fileUrl.split('.amazonaws.com/')[1];
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };

    const command = new DeleteObjectCommand(params);

    try {
        const data = await s3Client.send(command);
        console.log(`File deleted successfully from S3: ${fileUrl}`);
    } catch (error) {
        console.error(`Error deleting file from S3: ${fileUrl}`, error);
        throw error; // Rethrow error to handle it in calling function
    }
};

const postToInstagram = async (post) => {
    try {
        const mediaBuffer = await downloadFileFromS3(post.mediaUrl);
        let result;

        if (post.postType === 'reel') {
            result = await ig.publish.video({
                video: mediaBuffer,
                caption: post.caption,
            });
        } else if (post.postType === 'story') {
            result = await ig.publish.story({
                file: mediaBuffer,
                caption: post.caption,
            });
        } else {
            result = await ig.publish.photo({
                file: mediaBuffer,
                caption: post.caption,
            });
        }

        console.log('Posted to Instagram successfully!', result);
    } catch (error) {
        console.error('Error posting to Instagram:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

const processScheduledPosts = async () => {
    try {
        await loginToInstagram();

        const scheduledPosts = await Post.find({ scheduledTime: { $lte: new Date() } });
        console.log('Scheduled posts:', scheduledPosts);

        for (let post of scheduledPosts) {
            try {
                await postToInstagram(post);

                // Delete file from S3
                await deleteFileFromS3(post.mediaUrl);

                // Delete post from database
                await Post.findByIdAndDelete(post._id);

                console.log('Post successfully processed and cleaned up.');
            } catch (error) {
                console.error('Error processing post:', error);
                // Handle errors if needed
            }
        }

        console.log('Scheduled posts processed successfully!');
    } catch (error) {
        console.error('Error processing scheduled posts:', error);
    }
};

// Set up an interval to check for scheduled posts every minute
// setInterval(async () => {
//     try {
//         const hasScheduledPosts = await Post.exists({ scheduledTime: { $lte: new Date() } });
//         if (hasScheduledPosts) {
//             await processScheduledPosts();
//         } else {
//             console.log('No scheduled posts to process.');
//         }
//     } catch (error) {
//         console.error('Error checking scheduled posts:', error);
//     }
// }, 10000); // 60000 ms = 1 minute

module.exports = {
    processScheduledPosts,
};
