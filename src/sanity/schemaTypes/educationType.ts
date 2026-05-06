import { BookIcon as GraduationCapIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const educationType = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: GraduationCapIcon,
  fields: [
    defineField({
      name: 'school',
      title: 'School / Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
      description: "e.g. \"Master's degree\", \"PG Diploma\", \"Bachelor of Business Administration\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'field',
      title: 'Field of Study',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'e.g. "Apr 2025 - Dec 2026"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'gpa',
      title: 'GPA',
      type: 'string',
      description: 'e.g. "3.96" (leave blank if not applicable)',
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
      title: 'school',
      degree: 'degree',
      field: 'field',
      period: 'period',
    },
    prepare({ title, degree, field, period }) {
      return {
        title,
        subtitle: `${degree}, ${field} - ${period}`,
      }
    },
  },
})
