import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertCircle, CheckCircle2, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

const socialPlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    description: 'Share visual stories and engage with your audience',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877F2]',
    description: 'Connect with your community and share updates',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-[#0A66C2]',
    description: 'Network and share professional content',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-[#1DA1F2]',
    description: 'Engage in real-time conversations',
  },
];

export default function ConnectAccountsModal({ isOpen, onClose }) {
  const [connectedAccounts, setConnectedAccounts] = useState(new Set());
  const [confirmDisconnect, setConfirmDisconnect] = useState(null);

  const handleConnect = async (platform) => {
    try {
      // Simulated OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedAccounts(prev => new Set([...prev, platform.id]));
      toast.success(`Successfully connected to ${platform.name}!`, {
        icon: '✅',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error('Connection failed. Please try again.', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleDisconnect = (platform) => {
    setConfirmDisconnect(platform);
  };

  const confirmDisconnection = async () => {
    try {
      const platform = confirmDisconnect;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConnectedAccounts(prev => {
        const next = new Set(prev);
        next.delete(platform.id);
        return next;
      });
      
      toast.success(`Disconnected from ${platform.name}`, {
        icon: '🔌',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      setConfirmDisconnect(null);
    } catch (error) {
      toast.error('Failed to disconnect. Please try again.', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-neutral-surface p-6 shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-jakarta font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                      Connect Your Social Accounts
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-lg p-2 text-neutral-text-secondary hover:bg-neutral-bg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-neutral-text-secondary font-inter mb-6">
                    Connect your social media accounts to manage all your content in one place.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialPlatforms.map((platform) => (
                      <div
                        key={platform.id}
                        className="relative group rounded-xl border border-neutral-border bg-neutral-bg p-4 hover:border-primary/20 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${platform.color}`}>
                            <platform.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-jakarta font-semibold text-neutral-text-primary">
                                {platform.name}
                              </h3>
                              <div className="flex items-center">
                                {connectedAccounts.has(platform.id) ? (
                                  <span className="flex items-center text-sm font-medium text-status-success">
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Connected
                                  </span>
                                ) : (
                                  <span className="flex items-center text-sm font-medium text-neutral-text-secondary">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Not Connected
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-neutral-text-secondary font-inter">
                              {platform.description}
                            </p>
                            <div className="mt-4">
                              {connectedAccounts.has(platform.id) ? (
                                <button
                                  onClick={() => handleDisconnect(platform)}
                                  className="w-full px-4 py-2 text-sm font-medium text-status-error bg-status-error/10 rounded-lg hover:bg-status-error/20 transition-colors"
                                >
                                  Disconnect
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleConnect(platform)}
                                  className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-hover rounded-lg hover:from-primary-hover hover:to-primary transition-all duration-200 shadow-lg shadow-primary/25"
                                >
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Disconnect Confirmation Modal */}
      <Transition appear show={!!confirmDisconnect} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setConfirmDisconnect(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-surface p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-xl font-jakarta font-bold text-neutral-text-primary mb-4">
                    Confirm Disconnection
                  </Dialog.Title>
                  <p className="text-neutral-text-secondary font-inter mb-6">
                    Are you sure you want to disconnect your {confirmDisconnect?.name} account? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setConfirmDisconnect(null)}
                      className="px-4 py-2 text-sm font-medium text-neutral-text-primary bg-neutral-bg rounded-lg hover:bg-neutral-border transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDisconnection}
                      className="px-4 py-2 text-sm font-medium  text-white bg-red-500 rounded-lg hover:bg-red-700/90 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}