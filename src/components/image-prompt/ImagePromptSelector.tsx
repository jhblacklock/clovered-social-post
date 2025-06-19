"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

type Prompt = {
  id: string;
  text: string;
  isRecommended: boolean;
  explanation?: string;
};

type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
};

type ImagePromptSelectorProps = {
  onGenerate?: (images: GeneratedImage[]) => void;
  selectedPrompt: string;
  setSelectedPrompt: (promptId: string) => void;
  blogContent?: string;
  selectedPlatforms?: string[];
  platformPosts?: { id: string; text: string; hashtags: string }[];
};

// Some mock prompt templates for regeneration
const PROMPT_TEMPLATES = [
  [
    'A bright, modern workspace with creative professionals brainstorming together',
    'A cozy coffee shop with people working on laptops and sharing ideas',
    'A group of friends enjoying a sunny day in the park, laughing and talking',
  ],
  [
    'A bustling city street with diverse people walking and vibrant storefronts',
    'A peaceful library with students reading and studying at large tables',
    'A family cooking together in a cheerful kitchen, sharing stories',
  ],
  [
    'A team collaborating on a project in a glass-walled meeting room',
    'Children playing and learning in a colorful classroom',
    'A mentor guiding a young professional in a modern office',
  ],
];

const RATIONALES = [
  'Best matches your content and brand goals',
  'Likely to drive the most engagement for your audience',
  'Strong visual fit for your current post',
  'Optimized for clarity and shareability',
  'Aligns with your selected platforms and message',
];

function getRandomPrompts() {
  const set = PROMPT_TEMPLATES[Math.floor(Math.random() * PROMPT_TEMPLATES.length)];
  const recommendedIdx = Math.floor(Math.random() * set.length);
  const rationale = RATIONALES[Math.floor(Math.random() * RATIONALES.length)];
  return set.map((text, idx) => ({
    id: (idx + 1).toString(),
    text,
    isRecommended: idx === recommendedIdx,
    explanation: idx === recommendedIdx ? rationale : undefined,
  }));
}

export function ImagePromptSelector({ onGenerate, selectedPrompt, setSelectedPrompt, blogContent, selectedPlatforms, platformPosts }: ImagePromptSelectorProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      text: 'A warm, inviting classroom with diverse students engaged in discussion, natural light streaming through large windows',
      isRecommended: true,
      explanation: 'Best matches brand values of inclusivity and education'
    },
    {
      id: '2',
      text: 'Professional faculty members collaborating in a modern campus setting',
      isRecommended: false
    },
    {
      id: '3',
      text: 'Students participating in outdoor community activities on campus',
      isRecommended: false
    }
  ]);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // Regenerate prompts if upstream content changes
  useEffect(() => {
    setPrompts(getRandomPrompts());
    setSelectedPrompt('');
    setEditedPrompt('');
  }, [blogContent, selectedPlatforms, platformPosts, setSelectedPrompt]);

  // Add loading dots animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handlePromptSelect = (promptId: string) => {
    setSelectedPrompt(promptId);
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setEditedPrompt(prompt.text);
    }
  };

  const handleGenerateImages = async () => {
    if (!selectedPrompt || !editedPrompt) return;
    
    setIsGenerating(true);
    try {
      // Mock implementation - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual n8n webhook call
      // const response = await fetch('/api/generate-images', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     prompt: editedPrompt,
      //     brandConfig
      //   })
      // });
      
      // Mock response for now
      const mockImages = Array.from({ length: 3 }, (_, i) => ({
        id: `img-${i + 1}`,
        url: `https://picsum.photos/800/600?random=${i}`,
        prompt: editedPrompt
      }));
      
      if (onGenerate) onGenerate(mockImages);
    } catch (error) {
      console.error('Error generating images:', error);
      // TODO: Add error handling UI
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end mb-4">
        <Button
          className="min-w-[180px] text-xs px-4 py-2"
          onClick={() => {
            setPrompts(getRandomPrompts());
            setSelectedPrompt('');
            setEditedPrompt('');
          }}
        >
          Regenerate
        </Button>
      </div>
      {/* Prompt Selection */}
      <div className="grid gap-4">
        {prompts.map((prompt) => {
          const isSelected = selectedPrompt === prompt.id;
          return (
            <div
              key={prompt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`p-4 border rounded-lg cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-100 dark:bg-blue-900 border-primary' : ''}
                hover:bg-blue-200 dark:hover:bg-blue-800`
              }
              onClick={() => handlePromptSelect(prompt.id)}
              onKeyDown={e => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handlePromptSelect(prompt.id);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base">{prompt.text}</p>
                  </div>
                  {prompt.isRecommended && prompt.explanation && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-mono flex items-center gap-1">
                      <span>⭐ Recommended -</span> {prompt.explanation}
                    </p>
                  )}
                  {!prompt.isRecommended && prompt.explanation && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-mono">{prompt.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prompt Editing */}
      {selectedPrompt && (
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt-edit" className="block text-base font-medium mb-2">
              Edit Selected Prompt
            </label>
            <textarea
              id="prompt-edit"
              className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <Button
              onClick={handleGenerateImages}
              disabled={isGenerating || !editedPrompt}
              isGenerating={isGenerating}
              data-generate-button
            >
              {isGenerating ? `Generating${loadingDots}` : 'Generate 3 Image Options'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}