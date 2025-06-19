"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'x', label: 'X' },
  { id: 'facebook', label: 'Facebook' },
];

type Platform = typeof PLATFORMS[number]['id'];

type PlatformPost = {
  id: string;
  text: string;
  hashtags: string;
};

type PlatformPostGridProps = {
  selectedImageUrl?: string;
  selectedImagePrompt?: string;
  selectedPlatforms: string[];
  onApprovalChange?: (approved: boolean[]) => void;
  platformPosts: PlatformPost[];
  setPlatformPosts: (posts: PlatformPost[]) => void;
  onRunNewSet?: () => void;
};

type LocalPostState = {
  id: string;
  platform: Platform;
  imageUrl: string;
  imagePrompt: string;
  status: 'draft' | 'ready';
  showPromptEdit: boolean;
  isRegenImageLoading: boolean;
  isRegenTextLoading: boolean;
};

export function PlatformPostGrid({ selectedImageUrl, selectedImagePrompt, selectedPlatforms, onApprovalChange, platformPosts, setPlatformPosts, onRunNewSet }: PlatformPostGridProps) {
  // Local state for UI-specific fields
  const [localPosts, setLocalPosts] = useState<LocalPostState[]>(() => 
    PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map((p, i) => ({
      id: p.id,
      platform: p.id as Platform,
      imageUrl: selectedImageUrl || `https://picsum.photos/800/600?random=${i+1}`,
      imagePrompt: selectedImagePrompt || 'A professional, clean, and modern image',
      status: 'draft',
      showPromptEdit: false,
      isRegenImageLoading: false,
      isRegenTextLoading: false,
    }))
  );
  const [showSuccessModal, setShowSuccessModal] = useState<'buffer' | 'csv' | null>(null);

  // Keep local posts in sync with selectedPlatforms
  useEffect(() => {
    setLocalPosts(prevPosts => {
      const updated = prevPosts.filter(p => selectedPlatforms.includes(p.id));
      PLATFORMS.forEach((p, i) => {
        if (selectedPlatforms.includes(p.id) && !updated.find(up => up.id === p.id)) {
          updated.push({
            id: p.id,
            platform: p.id as Platform,
            imageUrl: selectedImageUrl || `https://picsum.photos/800/600?random=${i+1}`,
            imagePrompt: selectedImagePrompt || 'A professional, clean, and modern image',
            status: 'draft',
            showPromptEdit: false,
            isRegenImageLoading: false,
            isRegenTextLoading: false,
          });
        }
      });
      return updated;
    });
  }, [selectedPlatforms, selectedImageUrl, selectedImagePrompt]);

  // Notify parent of approval state
  useEffect(() => {
    if (onApprovalChange) {
      onApprovalChange(localPosts.filter(p => selectedPlatforms.includes(p.id)).map(p => p.status === 'ready'));
    }
  }, [localPosts, selectedPlatforms, onApprovalChange]);

  // Initialize with placeholder text if empty
  useEffect(() => {
    setPlatformPosts(platformPosts.map(post => {
      if (!post.text.trim()) {
        const platform = PLATFORMS.find(p => p.id === post.id);
        return {
          ...post,
          text: `[${platform?.label}] This is a sample post text. Click "Regenerate Text" to get a new version.`,
          hashtags: '#sample #hashtags'
        };
      }
      return post;
    }));
  }, [platformPosts, setPlatformPosts]);

  // Export CSV (mock)
  const handleExportCSV = () => {
    // Only include posts for selected platforms AND approved (status 'ready')
    const filteredLocalPosts = localPosts.filter(lp => selectedPlatforms.includes(lp.id) && lp.status === 'ready');
    const filteredPlatformPosts = platformPosts.filter(p => filteredLocalPosts.some(lp => lp.id === p.id));
    // Get local date/time in MM/DD/YYYY HH:MM:SS AM/PM format
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedDate = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(hours)}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`;

    const csvRows = [
      'Platform,Content,Hashtags,Image URL,Status,Created Date & Time',
      ...filteredPlatformPosts.map(p => {
        const localPost = filteredLocalPosts.find(lp => lp.id === p.id);
        return [
          PLATFORMS.find(pl => pl.id === p.id)?.label,
          JSON.stringify(p.text),
          JSON.stringify(p.hashtags),
          localPost?.imageUrl || '',
          localPost?.status || 'draft',
          formattedDate
        ].join(',');
      })
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts.csv';
    a.click();
    URL.revokeObjectURL(url);
    setShowSuccessModal('csv');
  };

  // Push to Buffer (mock)
  const handlePushToBuffer = async () => {
    // Only push selected and approved platforms
    setShowSuccessModal('buffer');
  };

  const handleFieldChange = (id: string, field: 'text' | 'hashtags', value: string) => {
    setPlatformPosts(
      platformPosts.map(pp =>
        pp.id === id ? { ...pp, [field]: value } : pp
      )
    );
  };

  const handleApproveChange = (id: string, value: 'draft' | 'ready') => {
    setLocalPosts(prev => prev.map(p => p.id === id ? { ...p, status: value } : p));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformPosts.filter(p => selectedPlatforms.includes(p.id)).map((post) => {
          const localPost = localPosts.find(lp => lp.id === post.id);
          if (!localPost) return null;
          
          return (
            <div key={post.id} className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold capitalize">{PLATFORMS.find(p => p.id === post.id)?.label}</h3>
              </div>
              <div className="relative w-full h-[300px] mb-4">
                <Image
                  src={localPost.imageUrl}
                  alt={`Post image for ${localPost.platform}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">Post Text</label>
                </div>
                <div style={{ marginBottom: 15 }} />
                <textarea
                  className="w-full border rounded p-2 text-base min-h-[80px]"
                  value={post.text}
                  onChange={e => handleFieldChange(post.id, 'text', e.target.value)}
                  placeholder="Write your post..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hashtags</label>
                <input
                  className="w-full border rounded p-2 text-base"
                  value={post.hashtags}
                  onChange={e => handleFieldChange(post.id, 'hashtags', e.target.value)}
                  placeholder="#hashtag1 #hashtag2"
                />
              </div>
              <div className="mt-6">
                <Button
                  className={`w-full py-3 text-base font-semibold rounded-lg transition-colors ${
                    localPost.status === 'ready'
                      ? '!bg-green-600 !text-white !border-green-700 shadow-md'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={() => handleApproveChange(post.id, localPost.status === 'ready' ? 'draft' : 'ready')}
                >
                  {localPost.status === 'ready' ? 'Approved' : 'Press to Approve'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Platform lozenges above export/push if approved */}
      <div className="flex flex-wrap gap-2 mb-2">
        {localPosts.filter(p => p.status === 'ready').map(p => (
          <span key={p.id} className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
            {PLATFORMS.find(pl => pl.id === p.id)?.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-start gap-4 mt-6">
        <Button onClick={handleExportCSV} className="text-xl min-w-[180px] py-4" disabled={localPosts.every(p => p.status !== 'ready')}>Export CSV</Button>
        <Button onClick={handlePushToBuffer} className="text-xl min-w-[180px] py-4" disabled={localPosts.every(p => p.status !== 'ready')}>Push to Buffer</Button>
      </div>
      {/* Success Modal for Export CSV or Push to Buffer */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {showSuccessModal === 'buffer' ? 'Posts Sent to Buffer!' : 'CSV Exported!'}
            </h2>
            <p className="mb-2 text-gray-700 dark:text-gray-200">
              {showSuccessModal === 'buffer'
                ? 'Your posts have been sent to Buffer! What would you like to do next?'
                : 'Your posts have been exported as a CSV file! What would you like to do next?'}
            </p>
            <p className="mb-6 text-xs text-gray-500 dark:text-gray-400">
              Starting a new post will erase your current content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setShowSuccessModal(null);
                  if (onRunNewSet) onRunNewSet();
                }}
              >
                New Post
              </button>
              <button
                className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setShowSuccessModal(null)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 