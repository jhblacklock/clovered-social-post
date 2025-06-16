import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'x', label: 'X' },
  { id: 'facebook', label: 'Facebook' },
];

type PostTextOptionsProps = {
  initialText?: string;
  selectedPlatforms: string[];
  platformPosts: { id: string; text: string; hashtags: string }[];
  setPlatformPosts: (posts: { id: string; text: string; hashtags: string }[]) => void;
};

export function PostTextOptions({ initialText = '', selectedPlatforms, platformPosts, setPlatformPosts }: PostTextOptionsProps) {
  // Add placeholder text on mount if empty
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [regenLoading, setRegenLoading] = useState<{ [id: string]: boolean }>({});
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleFieldChange = (id: string, field: 'text' | 'hashtags', value: string) => {
    setPlatformPosts(
      platformPosts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleRegenerate = async (id: string) => {
    setRegenLoading(prev => ({ ...prev, [id]: true }));
    await new Promise(resolve => setTimeout(resolve, 1200));
    setPlatformPosts(platformPosts.map(post => {
      if (post.id === id) {
        const platform = PLATFORMS.find(p => p.id === id);
        return {
          ...post,
          text: `[${platform?.label}] Regenerated post text at ${new Date().toLocaleTimeString()}. This is a new version of the post text.`,
          hashtags: '#regenerated #new #hashtags'
        };
      }
      return post;
    }));
    setRegenLoading(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="space-y-6">
      {platformPosts.filter(post => selectedPlatforms.includes(post.id)).map((post) => (
        <div key={post.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 space-y-3">
          <div className="mb-2 font-semibold">Platform: {PLATFORMS.find(p => p.id === post.id)?.label || post.id}</div>
          <div>
            <label className="block text-sm font-medium mb-1">Post Text</label>
            <textarea
              className="w-full border rounded p-2 text-base min-h-[80px]"
              value={post.text}
              onChange={(e) => handleFieldChange(post.id, 'text', e.target.value)}
              placeholder="Write your post..."
            />
            <div className="flex justify-end mt-2 mb-[15px]">
              <Button
                className="text-xs"
                onClick={() => handleRegenerate(post.id)}
                disabled={regenLoading[post.id]}
              >
                {regenLoading[post.id] ? `Regenerating${loadingDots}` : 'Regenerate Text'}
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hashtags</label>
            <input
              className="w-full border rounded p-2 text-base"
              value={post.hashtags}
              onChange={(e) => handleFieldChange(post.id, 'hashtags', e.target.value)}
              placeholder="#hashtag1 #hashtag2"
            />
          </div>
        </div>
      ))}
    </div>
  );
} 