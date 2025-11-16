import type {StructureResolver} from 'sanity/structure'
import {RocketIcon, DocumentTextIcon, UserIcon, BellIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio CMS')
    .items([
      // Projects Section
      S.listItem()
        .title('Projects')
        .icon(RocketIcon)
        .child(
          S.documentTypeList('project')
            .title('All Projects')
            .filter('_type == "project"')
            .defaultOrdering([{field: 'featured', direction: 'desc'}, {field: '_createdAt', direction: 'desc'}])
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('project')
            )
        ),
      
      S.divider(),
      
      // Blog Section
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Published Posts')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Published Posts')
                    .filter('_type == "post" && publishedAt < now()')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Draft Posts')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Draft Posts')
                    .filter('_type == "post" && publishedAt > now()')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.divider(),
              S.documentTypeListItem('post').title('All Posts'),
              S.documentTypeListItem('author').title('Authors').icon(UserIcon),
            ])
        ),
      
      S.divider(),
      
      // Settings Section
      S.listItem()
        .title('Site Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Announcement Bar')
                .icon(BellIcon)
                .child(
                  S.documentTypeList('announcement')
                    .title('Announcement Bar')
                    .filter('_type == "announcement"')
                ),
            ])
        ),
    ])