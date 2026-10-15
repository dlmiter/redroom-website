const INSTAGRAM_ACCOUNT_ID = "17841478159476386";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/instagram") {
            try {
                const fields = [
                    "id",
                    "media_type",
                    "media_product_type",
                    "media_url",
                    "thumbnail_url",
                    "permalink",
                    "timestamp"
                ].join(",");

                const apiUrl =
                    `https://graph.facebook.com/v26.0/${INSTAGRAM_ACCOUNT_ID}/media` +
                    `?fields=${encodeURIComponent(fields)}` +
                    `&limit=12` +
                    `&access_token=${encodeURIComponent(env.INSTAGRAM_ACCESS_TOKEN)}`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    const error = await response.text();

                    return Response.json(
                        {
                            ok: false,
                            error: "Instagram API request failed",
                            details: error
                        },
                        { status: response.status }
                    );
                }

                const data = await response.json();

                const reels = (data.data || [])
                    .filter(
                        (item) =>
                            item.media_type === "VIDEO" &&
                            item.media_product_type === "REELS"
                    )
                    .map((item) => ({
                        id: item.id,
                        video: item.media_url,
                        thumbnail: item.thumbnail_url,
                        instagram: item.permalink,
                        timestamp: item.timestamp
                    }));

                return Response.json(
                    {
                        ok: true,
                        reels
                    },
                    {
                        headers: {
                            "Cache-Control": "public, max-age=300"
                        }
                    }
                );
            } catch (error) {
                return Response.json(
                    {
                        ok: false,
                        error: "Worker error"
                    },
                    { status: 500 }
                );
            }
        }

        return env.ASSETS.fetch(request);
    }
};
