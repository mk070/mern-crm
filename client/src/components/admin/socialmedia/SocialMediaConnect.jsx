import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import ConnectAccounts from './ConnectAccounts';

export default function SocialMediaConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-neutral-text-primary font-jakarta">
            Social Media Accounts
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-xl text-white bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary transition-all duration-200 shadow-lg shadow-primary/25 font-inter"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Connect Accounts
          </button>
        </div>

        <div className="bg-neutral-surface rounded-xl shadow-sm border border-neutral-border p-6">
          <div className="text-center py-8">
            <Share2 className="h-12 w-12 text-neutral-text-secondary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-text-primary font-jakarta mb-2">
              Connect Your Social Media Accounts
            </h2>
            <p className="text-neutral-text-secondary font-inter max-w-md mx-auto">
              Connect your social media accounts to start managing all your content in one place. Click the button above to get started.
            </p>
          </div>
        </div>
      </div>

      <ConnectAccounts
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}