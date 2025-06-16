"use client";

import { useState, useEffect } from 'react';
import { brandConfig } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';

type Platform = 'instagram' | 'linkedin' | 'x' | 'facebook';

type BlogInputPanelProps = {
  onGenerate?: () => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  blogContent: string;
  setBlogContent: (content: string) => void;
};

export function BlogInputPanel({ onGenerate, selectedPlatforms, setSelectedPlatforms, blogContent, setBlogContent }: BlogInputPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handlePlatformToggle = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSubmit = async () => {
    if (!blogContent || selectedPlatforms.length === 0) return;
    setIsLoading(true);
    try {
      // Mock implementation - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual n8n webhook call
      // const response = await fetch('/api/generate-content', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     blogContent,
      //     platforms: selectedPlatforms,
      //     brandConfig
      //   })
      // });
      // if (!response.ok) throw new Error('Failed to generate content');
      
      // Mock successful response
      console.log('Mock: Generated content for platforms:', selectedPlatforms);
    } catch (error) {
      console.error('Error generating content:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
      if (onGenerate) onGenerate();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <textarea
          id="blog-content"
          className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base placeholder:text-base"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          placeholder="Paste a URL or content here…"
        />
      </div>

      <div>
        <h3 className="text-base font-medium mb-3">Select Platforms</h3>
        <div className="mb-3">
          <button
            type="button"
            className={`w-full md:w-auto mb-2 px-4 py-2 rounded-lg border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
              ${selectedPlatforms.length === Object.keys(brandConfig.platform_overrides).length ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-900'}
              ${selectedPlatforms.length === Object.keys(brandConfig.platform_overrides).length ? 'border-blue-400 text-blue-900 dark:text-blue-200' : 'border-gray-300 text-gray-900 dark:text-white'}
              hover:bg-blue-200 dark:hover:bg-blue-800`
            }
            onClick={() => {
              const allPlatforms = Object.keys(brandConfig.platform_overrides);
              if (selectedPlatforms.length === allPlatforms.length) {
                setSelectedPlatforms([]);
              } else {
                setSelectedPlatforms(allPlatforms);
              }
            }}
          >
            {selectedPlatforms.length === Object.keys(brandConfig.platform_overrides).length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(brandConfig.platform_overrides).map((platform) => {
            const isSelected = selectedPlatforms.includes(platform as Platform);
            return (
              <div
                key={platform}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors font-medium select-none
                  ${isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''}
                  hover:bg-blue-200 dark:hover:bg-blue-800`
                }
                onKeyDown={e => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handlePlatformToggle(platform as Platform);
                  }
                }}
                onClick={() => handlePlatformToggle(platform as Platform)}
              >
                <span className="text-base capitalize text-gray-900 dark:text-white font-medium">
                  {platform}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading || !blogContent || selectedPlatforms.length === 0}
        isGenerating={isLoading}
      >
        {isLoading ? `Generating${loadingDots}` : 'Create Post Text'}
      </Button>
    </div>
  );
} 