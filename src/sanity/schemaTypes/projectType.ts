import { RocketIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  groups: [
    {name: 'basic', title: 'Basic Info', default: true},
    {name: 'details', title: 'Details'},
    {name: 'media', title: 'Media'},
    {name: 'content', title: 'Content'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'The name of your project',
      validation: (Rule) => Rule.required().max(100),
      group: 'basic',
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
      group: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief summary (shown in cards and previews)',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      group: 'basic',
    }),
    defineField({
      name: 'date',
      title: 'Project Date',
      type: 'string',
      description: 'e.g., "Oct 2025" or "2024-2025"',
      placeholder: 'Oct 2025',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show this project prominently on homepage',
      initialValue: false,
      group: 'basic',
    }),
    defineField({
      name: 'overview',
      title: 'Project Overview',
      type: 'text',
      description: 'Detailed overview (2-3 paragraphs)',
      rows: 5,
      group: 'details',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add relevant tags (e.g., AI, AWS, Flutter)',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(10),
      group: 'details',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      description: 'List the tech stack',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'name', 
              type: 'string', 
              title: 'Technology Name',
              validation: (Rule) => Rule.required(),
            },
            { 
              name: 'url', 
              type: 'url', 
              title: 'Documentation URL (optional)',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'url',
            },
          },
        },
      ],
      group: 'details',
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      description: 'List the main features or achievements',
      of: [{ type: 'string' }],
      group: 'details',
    }),
    defineField({
      name: 'link',
      title: 'Live Demo URL',
      type: 'url',
      description: 'Link to the live project',
      group: 'details',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Repository',
      type: 'url',
      description: 'Link to the source code',
      group: 'details',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Main project image (recommended: 1200x600px)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      description: 'Additional screenshots or images',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      group: 'media',
    }),
    defineField({
      name: 'body',
      title: 'Detailed Content',
      type: 'blockContent',
      description: 'Full project write-up with rich formatting',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      subtitle: 'date',
      featured: 'featured',
    },
    prepare({title, media, subtitle, featured}) {
      return {
        title: featured ? `⭐ ${title}` : title,
        media,
        subtitle,
      }
    },
  },
})