import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

export function useBreadcrumbs() {
  const route = useRoute()
  const router = useRouter()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = []
    const pathSegments = route.path.split('/').filter(Boolean)

    // Handle home page specifically
    if (route.path === '/' || route.path === '/dashboard') {
      const matchedRoute = router.getRoutes().find((r) => r.path === route.path)
      items.push({
        label: (matchedRoute?.meta?.title as string) || 'Dashboard',
        href: undefined, // No link since it's the current page
        isActive: true,
      })
      return items
    }

    // For other pages, add Dashboard as root
    items.push({
      label: 'Dashboard',
      href: '/',
      isActive: false,
    })

    // Generate breadcrumbs from path segments
    let currentPath = ''

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      // Find matching route to get meta info
      const matchedRoute = router.getRoutes().find((r) => r.path === currentPath)

      // Generate label from route name, meta.title, or segment
      let label: string

      if (matchedRoute?.meta?.title) {
        label = matchedRoute.meta.title as string
      } else if (matchedRoute?.name) {
        label = String(matchedRoute.name)
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      } else {
        // Fallback: capitalize the URL segment
        label = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      items.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast,
      })
    })

    return items
  })

  // Get current page title
  const currentPageTitle = computed(() => {
    // Priority: meta.title > route name > fallback
    if (route.meta?.title) {
      return route.meta.title as string
    }

    if (route.name) {
      return String(route.name)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    return 'Page'
  })

  // Get page description
  const pageDescription = computed(() => {
    return (route.meta?.description as string) || ''
  })

  return {
    breadcrumbs,
    currentPageTitle,
    pageDescription,
  }
}
