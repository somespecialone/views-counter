import { H3Event, getQuery } from 'h3'

export function useDeta(event: H3Event) {
  return event.context.deta
}

export async function getViews(event: H3Event) {
  const { slug } = event.context.params
  const { base } = useDeta(event)

  const { noIncrement: noIncrementRaw } = getQuery(event)
  const noIncrement = noIncrementRaw === '' || !!noIncrementRaw

  let data = (await base.get(slug)) as { views: number } | null
  if (!data && !noIncrement) {
    data = { views: 1 }
    await base.put(data, slug)
  } else if (!data) {
    data = { views: 0 }
  } else if (!noIncrement) {
    data.views++
    await base.update({ views: base.util.increment() }, slug)
  }

  return data.views
}
