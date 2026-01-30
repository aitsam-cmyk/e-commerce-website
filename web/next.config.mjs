/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "dummyimage.com" },
            { protocol: "http", hostname: "localhost", port: "4000" }
        ]
    }
};

export default nextConfig;
