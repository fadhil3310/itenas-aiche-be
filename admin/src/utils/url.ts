
const staticUrl = import.meta.env.VITE_STATIC_URL;

export function urlImg(path: string) {
    return staticUrl + "/" + path;
}