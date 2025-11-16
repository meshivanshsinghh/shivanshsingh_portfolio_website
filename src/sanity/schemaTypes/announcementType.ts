import {BellIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const announcementType = defineType({
  name: 'announcement',
  title: 'Announcement Bar',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'isActive',
      title: 'Show Announcement',
      type: 'boolean',
      description: 'Toggle to show/hide the announcement bar',
      initialValue: false,
    }),
    defineField({
      name: 'text',
      title: 'Announcement Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link (optional)',
      type: 'url',
      description: 'Add a link if users should click the announcement',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Text for the link button (e.g., "Learn more", "Apply now")',
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Info (Blue)', value: 'info'},
          {title: 'Success (Green)', value: 'success'},
          {title: 'Warning (Yellow)', value: 'warning'},
        ],
      },
      initialValue: 'info',
    }),
  ],
  preview: {
    select: {
      title: 'text',
      isActive: 'isActive',
    },
    prepare({title, isActive}) {
      return {
        title,
        subtitle: isActive ? '✓ Active' : '✗ Inactive',
      }
    },
  },
})