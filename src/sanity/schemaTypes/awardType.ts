import { StarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const awardType = defineType({
  name: 'award',
  title: 'Awards & Recognition',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Award Title',
      type: 'string',
      description: 'e.g. "Technical Innovation Award"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'org',
      title: 'Organization / Event',
      type: 'string',
      description: 'e.g. "CodeLinc10 - Lincoln Financial"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sponsor',
      title: 'Sponsor (optional)',
      type: 'string',
      description: 'e.g. "Cognizant"',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'e.g. "Oct 2025"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Short Context (optional)',
      type: 'string',
      description: 'One sentence of context shown on the site',
    }),
    defineField({
      name: 'image',
      title: 'Photo / Certificate (optional)',
      type: 'image',
      description: 'Upload a photo from the event, a LinkedIn post screenshot, or the certificate',
      options: { hotspot: true },
    }),
    defineField({
      name: 'url',
      title: 'Link (optional)',
      type: 'url',
      description: 'Link to post, article, LinkedIn announcement, or credential',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link Label (optional)',
      type: 'string',
      description: 'Custom label for the link button, e.g. "View LinkedIn post", "See certificate". Defaults to "View"',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower number = appears first.',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'org',
      date: 'date',
      media: 'image',
    },
    prepare({ title, subtitle, date, media }) {
      return {
        title,
        subtitle: `${subtitle} - ${date}`,
        media,
      }
    },
  },
})
