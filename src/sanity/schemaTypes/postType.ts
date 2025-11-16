import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Metadata'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      description: 'The title of your blog post',
      validation: (Rule) => Rule.required().max(100),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Click "Generate" to create from title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief summary for previews and SEO (150-160 characters)',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Featured image (recommended: 1200x630px)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for accessibility',
          validation: (Rule) => Rule.required(),
        })
      ],
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Post Content',
      type: 'blockContent',
      description: 'Write your blog post here',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      description: 'Select the post author',
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add relevant tags for categorization',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(10),
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this post was/will be published',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {author, publishedAt} = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'
      return {
        ...selection, 
        subtitle: author ? `${author} • ${date}` : date,
      }
    },
  },
})