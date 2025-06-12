import {
  AudioWaveform,
  ClipboardPlusIcon,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  Settings2,
  Users2,
} from 'lucide-vue-next'

export const data = {
  user: {
    name: 'Agata',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Iluk',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Willadentika',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Patients',
      url: '/patient',
      icon: Users2,
    },
    {
      title: 'Procedures',
      url: '/procedure',
      icon: ClipboardPlusIcon,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
    },
  ],
}
