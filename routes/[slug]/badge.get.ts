import badgen from 'gradient-badge'

export default eventHandler(async (event) => {
  const { label = 'views', labelColor, color, style, gradient, icon, iconWidth, scale } = getQuery(event)
  const counter = await getViews(event)

  defaultContentType(event, 'image/svg+xml; charset=utf-8')

  try {
    return badgen({
      label,
      status: counter.toString(),
      color,
      labelColor,
      style,
      // @ts-ignore
      gradient: gradient ? gradient.split('-') : gradient,
      icon,
      iconWidth,
      scale
    })
  } catch (e) {
    return badgen({
      label: 'error',
      color: 'red',
      status: 'invalid badge param/s'
    })
  }
})
