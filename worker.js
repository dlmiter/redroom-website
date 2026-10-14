export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/instagram") {
            return Response.json({
                ok: true,
                message: "Instagram API Worker is running"
            });
        }

        return env.ASSETS.fetch(request);
    }
};
