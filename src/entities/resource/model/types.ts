export type FileType = 'pdf' | 'jpg' | 'png' | 'etc'

export interface Resource {
  id: string
  fileType: FileType
  title: string
  date: string
}

export type CreateResourceInput = Pick<Resource, 'fileType' | 'title'>
