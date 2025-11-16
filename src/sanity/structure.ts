import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.divider(),
      S.documentTypeListItem('post').title('Blog Posts'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'author', 'project'].includes(item.getId()!),
      ),
    ])