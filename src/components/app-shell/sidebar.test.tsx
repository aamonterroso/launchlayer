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
  useParams: () => ({ workspaceId: 'test-workspace' }),
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

  it('renders the workspace name', async () => {
    await act(async () => {
      render(<Sidebar />);
    });
    expect(screen.getByText('test-workspace')).toBeInTheDocument();
  });
});
