import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {postType} from './postType'
import {authorType} from './authorType'
import {projectType} from './projectType'
import {announcementType} from './announcementType'
import {experienceType} from './experienceType'
import {educationType} from './educationType'
import {awardType} from './awardType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, postType, authorType, projectType, announcementType, experienceType, educationType, awardType],
}