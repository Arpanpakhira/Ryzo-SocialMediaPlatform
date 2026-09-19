export const searchMusic = async (req, res) => {
  try {
    const query = req.query.q || 'trending';
    const limit = req.query.limit || 25;

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`iTunes API responded with status ${response.status}`);
    }

    const data = await response.json();

    const formattedTracks = (data.results || []).map((item) => ({
      id: String(item.trackId || item.collectionId || Math.random()),
      title: item.trackName || item.collectionName || 'Unknown Title',
      artist: item.artistName || 'Unknown Artist',
      artwork: item.artworkUrl100 || item.artworkUrl60 || '',
      audio_url: item.previewUrl || '',
      genre: item.primaryGenreName || 'Pop',
      duration_ms: item.trackTimeMillis || 30000,
    }));

    res.json({
      success: true,
      query,
      count: formattedTracks.length,
      tracks: formattedTracks,
    });
  } catch (error) {
    console.error('Error searching music in controller:', error);
    res.status(500).json({ message: error.message, tracks: [] });
  }
};
