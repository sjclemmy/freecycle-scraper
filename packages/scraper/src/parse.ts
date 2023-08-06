import { rehype } from 'rehype'
import { visit } from 'unist-util-visit'

type FreecycleEntry = {
  subject: string
  description: string
  date: string
  time: string
  group: {
    name: string
  }
  id: string
}

export const parse = async (htmlFile: string) => {
  ;``
  const tree = rehype().parse(htmlFile)
  let requiredData
  visit(tree, 'element', (node) => {
    if (
      node.tagName === 'fc-data' &&
      node.properties &&
      node.properties[':data'] &&
      typeof node.properties[':data'] === 'string'
    ) {
      requiredData = JSON.parse(node.properties[':data'])
        .posts.filter(({ type }: any) => type.name.toLowerCase() === 'offer')
        .map(
          ({
            subject,
            description,
            date,
            time,
            group,
            id,
          }: FreecycleEntry) => ({
            subject,
            description,
            date,
            time,
            location: group.name,
            id,
          })
        )
    }
  })
  return requiredData
}
