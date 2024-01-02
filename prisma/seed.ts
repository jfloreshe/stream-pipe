import {
    type Video,
    type User,
    type VideoEngagement,
    type FollowEngagement,
    type Announcement,
    type AnnouncementEngagement,
    type Playlist,
    type PlaylistHasVideo,
    type Comment
} from "@prisma/client"
import { db as prisma } from "../src/server/db";
import fs from "fs";
import path from "path";

const currentFilePath = import.meta.url;
const __dirname = path.dirname(new URL(currentFilePath).pathname);
//const prisma = new PrismaClient();
const usersFile = path.join(__dirname, "data/user.json");
const users = JSON.parse(fs.readFileSync(usersFile, "utf-8")) as User[];

const videosFile = path.join(__dirname, "data/video.json");
const videos: Video[] = JSON.parse(
  fs.readFileSync(videosFile, "utf-8")
) as Video[];

const videoEngagementsFile = path.join(__dirname, "data/videoEngagement.json");
const videoEngagements: VideoEngagement[] = JSON.parse(
  fs.readFileSync(videoEngagementsFile, "utf-8")
) as VideoEngagement[];

const followEngagementsFile = path.join(
  __dirname,
  "data/followEngagement.json"
);
const followEngagements: FollowEngagement[] = JSON.parse(
  fs.readFileSync(followEngagementsFile, "utf-8")
) as FollowEngagement[];

const announcementsFile = path.join(__dirname, "data/announcement.json");
const announcements: Announcement[] = JSON.parse(
  fs.readFileSync(announcementsFile, "utf-8")
) as Announcement[];

const announcementEngagementsFile = path.join(
  __dirname,
  "data/announcementEngagement.json"
);
const announcementEngagements: AnnouncementEngagement[] = JSON.parse(
  fs.readFileSync(announcementEngagementsFile, "utf-8")
) as AnnouncementEngagement[];

const commentsFile = path.join(__dirname, "data/comment.json");
const comments: Comment[] = JSON.parse(
  fs.readFileSync(commentsFile, "utf-8")
) as Comment[];

const playlistsFile = path.join(__dirname, "data/playlist.json");
const playlists: Playlist[] = JSON.parse(
  fs.readFileSync(playlistsFile, "utf-8")
) as Playlist[];

const playlistHasVideoFile = path.join(__dirname, "data/playlistHasVideo.json");
const playlistHasVideos: PlaylistHasVideo[] = JSON.parse(
  fs.readFileSync(playlistHasVideoFile, "utf-8")
) as PlaylistHasVideo[];

async function processInChunk<T,U>(
    items: T[],
    chunkSize: number,
    processItem: (item: T) => Promise<U>
) : Promise<U[]> {
    const results: U[] = [];
    for (let i = 0; i < items.length; i+= chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(processItem);
        results.push(...(await Promise.all(chunkPromises)));
    }
    return results;
}

function generateNextId(start: number, end: number) {
    let current = start;
    return function getNextId() {
      const nextId = current;
      current = current >= end ? start : current + 1;
      return nextId.toString();
    };
}

const getNextVideoId = generateNextId(1, 31);
const getNextUserId = generateNextId(164, 178);
const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "";

async function main() {
    await prisma.user.deleteMany();
    await prisma.video.deleteMany();
    await prisma.videoEngagement.deleteMany();
    await prisma.followEngagement.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.announcementEngagement.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.playlistHasVideo.deleteMany();

    await processInChunk(users, 1, (user) => 
        prisma.user.upsert({
            where: {id: user.id},
            update: {
                ...user,
                emailVerified: user.emailVerified ? new Date(user.emailVerified) : undefined,
                image: user.image ? `https://res.cloudinary.com/${cloudinaryName}${user.image}` : null,
                backgroundImage: user.backgroundImage ? `https://res.cloudinary.com/${cloudinaryName}${user.backgroundImage}` : null,

            },
            create: {
                ...user,
                emailVerified: user.emailVerified ? new Date(user.emailVerified) : undefined,
                image: user.image ? `https://res.cloudinary.com/${cloudinaryName}${user.image}` : null,
                backgroundImage: user.backgroundImage ? `https://res.cloudinary.com/${cloudinaryName}${user.backgroundImage}` : null,
            },
        })
    );

    await processInChunk(videos, 1, (video) => 
        prisma.video.upsert({
            where: {id: video.id},
            update: {
                ...video,
                createdAt: video.createdAt ? new Date(video.createdAt) : undefined,
                thumbnailUrl: `https://res.cloudinary.com/${cloudinaryName}${video.thumbnailUrl}`,
                videoUrl: `https://res.cloudinary.com/${cloudinaryName}${video.videoUrl}`,
            },
            create: {
                ...video,
                createdAt: video.createdAt ? new Date(video.createdAt) : undefined,
                thumbnailUrl: `https://res.cloudinary.com/${cloudinaryName}${video.thumbnailUrl}`,
                videoUrl: `https://res.cloudinary.com/${cloudinaryName}${video.videoUrl}`,
            },
        })
    );

    await processInChunk(videoEngagements, 1, (videoEngagement) =>
        prisma.videoEngagement.create({ data: videoEngagement })
    );

    await processInChunk(followEngagements, 1, async (followEngagement) => {
        const existingFollowEngagements = await prisma.followEngagement.findMany({
            where: {
                followerId: followEngagement.followerId,
                followingId: followEngagement.followingId,
            },
        });
        if (existingFollowEngagements.length === 0 || !existingFollowEngagements) {
            return prisma.followEngagement.create({ data: followEngagement });
        } else {
            return;
        }
    });

    await processInChunk(announcements, 1, (announcement) =>
        prisma.announcement.create({ data: announcement })
    );

    await processInChunk(
        announcementEngagements,
        1,
        async (announcementEngagement) => {
        // Try to find an existing announcementEngagement record with the same userId and announcementId
        const existingAnnouncementEngagements =
            await prisma.announcementEngagement.findMany({
            where: {
                announcementId: announcementEngagement.announcementId, // Fixed typo here
                userId: announcementEngagement.userId,
            },
            });
        if (
            existingAnnouncementEngagements.length === 0 ||
            !existingAnnouncementEngagements
        ) {
            return prisma.announcementEngagement.create({
            data: announcementEngagement,
            });
        } else {
            return;
        }
        }
    );
    await processInChunk(comments, 1, (comment) =>
        prisma.comment.upsert({
        where: { id: comment.id },
        update: {
            ...comment,
            videoId: getNextVideoId(),
            userId: getNextUserId(),
            createdAt: comment.createdAt ? new Date(comment.createdAt) : undefined,
        },
        create: {
            ...comment,
            userId: getNextUserId(),
            videoId: getNextVideoId(),
            createdAt: comment.createdAt ? new Date(comment.createdAt) : undefined,
        },
        })
    );

    await processInChunk(playlists, 1, async (playlist) =>
        prisma.playlist.upsert({
        where: { id: playlist.id },
        update: {
            ...playlist,
            userId: getNextUserId(),
            createdAt: playlist.createdAt
            ? new Date(playlist.createdAt)
            : undefined,
        },
        create: {
            ...playlist,
            userId: getNextUserId(),
            createdAt: playlist.createdAt
            ? new Date(playlist.createdAt)
            : undefined,
        },
        })
    );

    await processInChunk(playlistHasVideos, 1, (playlistHasVideo) =>
        prisma.playlistHasVideo.create({ data: playlistHasVideo })
    );
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })