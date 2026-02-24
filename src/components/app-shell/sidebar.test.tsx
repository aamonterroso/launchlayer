import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './sidebar';
import type { DemoWorkspace } from '@/lib/auth/session';

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
  useRouter: () => ({ refresh: vi.fn() }),
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
  ChevronsUpDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-chevrons" {...props} />
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-check" {...props} />
  ),
}));

// ---------- Fixtures ----------

const mockWorkspaces: DemoWorkspace[] = [
  { id: 'ws_01', name: 'Acme Corp', slug: 'acme-corp' },
  { id: 'ws_02', name: 'Side Project', slug: 'side-project' },
  { id: 'ws_03', name: 'Open Source', slug: 'open-source' },
];

const defaultProps = {
  activeWorkspace: mockWorkspaces[0]!,
  workspaces: mockWorkspaces,
  navItems: [
    { label: 'Dashboard', href: '/app' },
    { label: 'Members', href: '/app/members' },
    { label: 'Settings', href: '/app/settings' },
  ],
};

// ---------- Tests ----------

describe('Sidebar', () => {
  it('renders navigation items with icons', async () => {
    await act(async () => {
      render(<Sidebar {...defaultProps} />);
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
      render(<Sidebar {...defaultProps} />);
    });
    expect(screen.getByText('LaunchLayer')).toBeInTheDocument();
  });

  it('generates correct link hrefs', async () => {
    await act(async () => {
      render(<Sidebar {...defaultProps} />);
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
      render(<Sidebar {...defaultProps} />);
    });
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.className).toContain('bg-primary/15');
    expect(dashboardLink?.className).toContain('font-semibold');

    const membersLink = screen.getByText('Members').closest('a');
    expect(membersLink?.className).toContain('text-muted-foreground');
  });

  it('adds title attributes for accessibility', async () => {
    await act(async () => {
      render(<Sidebar {...defaultProps} />);
    });
    expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
    expect(screen.getByTitle('Members')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });

  it('renders the active workspace name in the switcher', async () => {
    await act(async () => {
      render(<Sidebar {...defaultProps} />);
    });
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders workspace switcher with null workspace gracefully', async () => {
    await act(async () => {
      render(<Sidebar activeWorkspace={null} workspaces={[]} navItems={[]} />);
    });
    expect(screen.getByText('No workspace')).toBeInTheDocument();
  });
});
