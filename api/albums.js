import { listAlbums } from "./cloudinaryService.js";

export default async function handler(req, res) {
  try {
    const albums = await listAlbums("NUCT Gallery");

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json({
      success: true,
      albums,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
