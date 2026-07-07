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
      title: 'Primary Photo / Certificate (optional)',
      type: 'image',
      description: 'Upload a primary photo from the event, a LinkedIn post screenshot, or the certificate',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Upload multiple photos. If provided, these will display as a fading slideshow in the bento tile.',
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
    defineField({
      name: 'bentoSize',
      title: 'Bento Grid Size',
      type: 'string',
      description: 'Size of the award in the bento grid layout (only applies if it has an image)',
      options: {
        list: [
          { title: 'Large (2x2)', value: 'large' },
          { title: 'Wide (2x1)', value: 'wide' },
          { title: 'Square (1x1)', value: 'square' },
        ],
        layout: 'radio',
      },
      initialValue: 'square',
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
