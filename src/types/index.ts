export interface VideoItem {
  id: string
  platform: 'bilibili' | 'youtube'
  thumbnail?: string
}

export interface ImageItem {
  link: string
  img: string
}

export interface ContactItem {
  icon: string
  label: string
  url: string
}

export interface VideoSection {
  title: string
  subtitle: string
  items: VideoItem[]
}

export interface ImageSection {
  title: string
  subtitle: string
  items: ImageItem[]
}

export interface FooterConfig {
  profileImage: string
  headerText: string
  contacts: ContactItem[]
  repoText: string
  repoUrl: string
  /** 可选的自定义 HTML 内容，会渲染在联系方式下方 */
  customContent?: string
}

export interface ProjectConfig {
  title: string
  favicon: string
  backgroundColor: string
  characterName: string
  headerTitle: string
  headerSubtitle: string
  buttonText: string
  counterLabel: string
  counterUnit: string
  video: VideoSection
  img: ImageSection
  chibiImages: string[]
  audioFiles: string[]
  footer: FooterConfig
}
