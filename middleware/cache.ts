export default eventHandler((event) => {
  // no-store isn't enough for github proxy servers (masking markdown badge source urls)
  setResponseHeaders(event, { 'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate' })
})
