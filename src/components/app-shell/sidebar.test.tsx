import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './sidebar';

vi.mock('next/link', () => ({
  default: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a {...props}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/app',
}));

describe('Sidebar', () => {
  it('renders navigation items', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the app name', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    expect(screen.getByText('LaunchLayer')).toBeInTheDocument();
  });

  it('generates correct link hrefs', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute(
      'href',
      '/app',
    );
    expect(screen.getByText('Members').closest('a')).toHaveAttribute(
      'href',
      '/app/members',
    );
    expect(screen.getByText('Settings').closest('a')).toHaveAttribute(
      'href',
      '/app/settings',
    );
  });

  it('applies active styling to the current route', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.className).toContain('bg-primary/10');
    expect(dashboardLink?.className).toContain('font-semibold');

    const membersLink = screen.getByText('Members').closest('a');
    expect(membersLink?.className).toContain('text-muted-foreground');
  });

  it('adds title attributes for accessibility', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
    expect(screen.getByTitle('Members')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });
});
