export default eventHandler((event) => {
  setResponseHeaders(event, { 'Cache-Control': 'no-store' })
})
