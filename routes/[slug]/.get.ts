export default eventHandler(async (event) => {
  const counter = await getViews(event)

  return { counter }
})
