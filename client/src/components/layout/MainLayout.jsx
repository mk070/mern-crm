import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainLayout({ children, showBackButton = false }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary/2 to-neutral-bg">
      <header className="fixed top-0 left-0 right-0 bg-neutral-surface/80 backdrop-blur-lg border-b border-neutral-border/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <div className="bg-primary/10 rounded-xl p-2 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="ml-3 text-xl font-jakarta font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                CRM Pro
              </h1>
            </Link>
            {showBackButton && (
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-neutral-text-secondary hover:text-primary transition-colors"
              >
                Back to home
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20 min-h-screen">
        {children}
      </main>

      <footer className="bg-neutral-surface border-t border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-jakarta font-semibold text-neutral-text-primary">
                CRM Pro
              </span>
            </div>
            <p className="text-sm text-neutral-text-secondary font-inter">
              © 2025 CRM Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}