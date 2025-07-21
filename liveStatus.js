const YOUTUBE_API_KEY = 'AIzaSyA15KJjJsVN_TihNhwmt1r3LjpC89EBUPA';
const CHANNEL_ID = 'UCV4kSci2f77689zzaxIs_DQ';

async function checkYouTubeLiveStatus() {
  const liveBanner = document.getElementById('live-banner');
  const liveDot = document.getElementById('liveDot');
  const liveStreamContainer = document.getElementById('liveStreamContainer');

  if(!liveBanner || !liveDot) return; // safety check

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();

    const isLive = data.items && data.items.length > 0;
    if (isLive) {
      liveBanner.style.display = 'block';
      liveDot.classList.remove('hidden');

      // Embed the live stream video
      if (liveStreamContainer) {
        const liveVideoId = data.items[0].id.videoId;
        liveStreamContainer.innerHTML = `
          <iframe width="560" height="315"
            src="https://www.youtube.com/embed/${liveVideoId}?autoplay=1&mute=1"
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
        `;
      }
    } else {
      liveBanner.style.display = 'none';
      liveDot.classList.add('hidden');
      if (liveStreamContainer) liveStreamContainer.innerHTML = '<p>No live stream currently.</p>';
    }
  } catch (error) {
    console.error('Error fetching live status:', error);
    liveBanner.style.display = 'none';
    liveDot.classList.add('hidden');
    if (liveStreamContainer) liveStreamContainer.innerHTML = '<p>Could not check live status.</p>';
  }
}

window.addEventListener('load', checkYouTubeLiveStatus);