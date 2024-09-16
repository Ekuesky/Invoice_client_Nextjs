/** @type {import('next').NextConfig} */

const nextConfig = {
    // enable ppr option
    experimental: {
        ppr: 'incremental',
    }
};

export default nextConfig;
