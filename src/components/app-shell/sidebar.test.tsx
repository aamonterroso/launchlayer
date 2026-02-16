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

vi.mock('lucide-react', () => ({
  LayoutDashboard: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-dashboard" {...props} />
  ),
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-members" {...props} />
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-settings" {...props} />
  ),
}));

describe('Sidebar', () => {
  it('renders navigation items with icons', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('icon-members')).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
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
    expect(dashboardLink?.className).toContain('bg-primary/15');
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
