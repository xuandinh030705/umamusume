import prisma from "./prisma";

export type NotificationType = "WALLPAPER_NEW" | "REQUEST_DONE" | "COMMENT_REPLY" | "SYSTEM";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  content: string;
  link?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        content: params.content,
        link: params.link,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyFollowersNewWallpaper(
  characterId: string,
  wallpaperTitle: string,
  wallpaperId: string
): Promise<void> {
  try {
    const followers = await prisma.follow.findMany({
      where: { characterId },
      select: { userId: true },
    });

    const notifications = followers.map((follower) => ({
      userId: follower.userId,
      type: "WALLPAPER_NEW" as NotificationType,
      content: `New wallpaper "${wallpaperTitle}" uploaded!`,
      link: `/wallpapers/${wallpaperId}`,
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
    }
  } catch (error) {
    console.error("Failed to notify followers:", error);
  }
}

export async function notifyRequestDone(
  requestId: string,
  characterName: string
): Promise<void> {
  try {
    const request = await prisma.characterRequest.findUnique({
      where: { id: requestId },
      select: { userId: true },
    });

    if (request) {
      await createNotification({
        userId: request.userId,
        type: "REQUEST_DONE",
        content: `Your request for "${characterName}" has been completed!`,
        link: `/characters/${characterName.toLowerCase().replace(/\s+/g, "-")}`,
      });
    }
  } catch (error) {
    console.error("Failed to notify request owner:", error);
  }
}

export async function notifyCommentReply(
  commentOwnerId: string,
  replierName: string,
  wallpaperId: string
): Promise<void> {
  try {
    await createNotification({
      userId: commentOwnerId,
      type: "COMMENT_REPLY",
      content: `${replierName} replied to your comment`,
      link: `/wallpapers/${wallpaperId}`,
    });
  } catch (error) {
    console.error("Failed to notify comment owner:", error);
  }
}
