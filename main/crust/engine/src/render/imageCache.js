export const imageCache = {};

export function getUserIcon(userId) {
    if (!imageCache[userId]) {
        const img = new Image();
        img.src = `https://user.gangdev.co/${userId}/icon/user-icon.jpg`;
        imageCache[userId] = img;
    }
    return imageCache[userId];
}