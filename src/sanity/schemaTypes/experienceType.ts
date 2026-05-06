import { CaseIcon as BriefcaseIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  icon: BriefcaseIcon,
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g. "Jan 2026 - Present"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: ['Full-time', 'Contract', 'Part-time', 'Internship', 'Freelance'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Boston, MA" or "Remote"',
    }),
    defineField({
      name: 'description',
      title: 'Description Bullets',
      type: 'array',
      description: 'Each item is one bullet point',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'skills',
      title: 'Skills / Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower number = appears first. 1 = most recent.',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'company',
      period: 'period',
    },
    prepare({ title, subtitle, period }) {
      return {
        title,
        subtitle: `${subtitle} - ${period}`,
      }
    },
  },
})
