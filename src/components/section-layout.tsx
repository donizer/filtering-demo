import type { CSSProperties, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { cn } from '#/lib/utils'

type SectionNavItem = {
  to: string
  label: string
  exact?: boolean
}

interface SectionLayoutProps {
  kicker: string
  title: string
  items: readonly SectionNavItem[]
  contentClassName?: string
  children: ReactNode
}

export function SectionLayout({
  kicker,
  title,
  items,
  contentClassName,
  children,
}: SectionLayoutProps) {
  return (
    <SidebarProvider
      className="min-h-0 w-full md:px-4 xl:px-5"
      style={
        {
          '--sidebar-width': '13.5rem',
        } as CSSProperties
      }
    >
      <div className="md:hidden">
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
          <SectionSidebarContent kicker={kicker} title={title} items={items} />
        </Sidebar>
      </div>

      <div className="md:grid md:min-h-full md:grid-cols-[13.5rem_minmax(0,1fr)] md:items-start md:gap-4 xl:gap-5">
        <aside className="hidden self-start md:sticky md:top-20 md:block">
          <Sidebar
            collapsible="none"
            className="island-shell h-fit w-full rounded-3xl border border-(--line) bg-(--surface) text-sidebar-foreground"
          >
            <SectionSidebarContent
              kicker={kicker}
              title={title}
              items={items}
            />
          </Sidebar>
        </aside>

        <SidebarInset className="min-h-0 bg-transparent">
          <section
            className={cn(
              'mx-auto w-full max-w-370 px-4 pb-1 md:px-8 md:pr-10 xl:px-10',
              contentClassName,
            )}
          >
            <div className="island-shell flex items-center gap-3 rounded-2xl p-3.5 md:hidden">
              <SidebarTrigger className="size-9 rounded-xl border border-(--line) bg-(--surface-strong)" />

              <div className="min-w-0">
                <p className="island-kicker">{kicker}</p>
                <h1 className="display-title truncate text-xl font-semibold tracking-tight text-(--sea-ink)">
                  {title}
                </h1>
              </div>
            </div>

            <div className="rise-in min-w-0 space-y-3 md:space-y-4">
              {children}
            </div>
          </section>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function SectionSidebarContent({
  kicker,
  title,
  items,
}: Pick<SectionLayoutProps, 'kicker' | 'title' | 'items'>) {
  return (
    <>
      <SidebarHeader className="gap-0 border-b border-sidebar-border/70 px-3.5 py-5 md:px-4 md:py-6">
        <p className="island-kicker text-sidebar-foreground/70">{kicker}</p>
        <div className="display-title mt-2 text-[1.65rem] leading-tight font-semibold tracking-tight text-sidebar-foreground">
          {title}
        </div>
        <p className="mt-3 text-sm leading-6 text-sidebar-foreground/70">
          {items.length} сторінок у розділі
        </p>
      </SidebarHeader>

      <SidebarContent className="pb-4">
        <SidebarGroup className="px-2.5 py-3 md:px-3">
          <SidebarGroupLabel className="px-3 tracking-[0.18em] uppercase">
            Навігація
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    size="default"
                    tooltip={item.label}
                    className="h-auto rounded-xl px-3 py-2.5 text-[0.95rem] shadow-none"
                  >
                    <Link
                      to={item.to}
                      activeOptions={{ exact: item.exact ?? false }}
                      className="font-medium no-underline"
                      activeProps={{
                        className:
                          'bg-sidebar-accent text-sidebar-accent-foreground shadow-none',
                      }}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}
