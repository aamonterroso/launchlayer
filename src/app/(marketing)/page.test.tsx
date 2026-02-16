import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './page';

vi.mock('next/link', () => ({
  default: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a {...props}>{children}</a>,
}));

describe('HomePage', () => {
  it('renders the hero heading', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText(/build better products/i)).toBeInTheDocument();
  });

  it('renders the features section', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText(/workspace management/i)).toBeInTheDocument();
  });

  it('renders the CTA section', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText(/ready to get started/i)).toBeInTheDocument();
  });
});
