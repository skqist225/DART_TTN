export default function getImage(imageName) {
    return `${
        import.meta.env.VITE_NODE_ENV === "development"
            ? import.meta.env.VITE_LOCAL_SERVER_URL + `${imageName}`
            : import.meta.env.VITE_REMOTE_SERVER_URL + `${imageName}`
    }`;
}
