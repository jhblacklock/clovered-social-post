"use client";
import { useState, useEffect, useRef } from "react";
import { BlogInputPanel } from "@/components/blog-input/BlogInputPanel";
import { ImagePromptSelector } from "@/components/image-prompt/ImagePromptSelector";
import { PlatformPostGrid } from "@/components/platform-post/PlatformPostGrid";
import { Button } from "@/components/ui/Button";
import { PostTextOptions } from '@/components/platform-post/PostTextOptions';
import { Checklist } from '@/components/ui/Checklist';
import { StepIndicator } from '@/components/ui/StepIndicator';
import React from "react";
import Image from 'next/image';

type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
};

// Utility for platform list
const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'x', label: 'X' },
  { id: 'facebook', label: 'Facebook' },
];

export default function Home() {
  // Step state: 0 = Blog Input, 1 = Post Text Options, 2 = Image Prompt, 3 = Image Generation, 4 = Platform Post Grid
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0); // Track the furthest completed step
  const [blogContent, setBlogContent] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  const [imageLoading, setImageLoading] = useState<{ [id: string]: boolean }>({});
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [postApprovals, setPostApprovals] = useState<boolean[]>([]);
  const [showNewSetModal, setShowNewSetModal] = useState(false);
  // Refs for each step section
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Shared post text/hashtags state for each platform
  const [platformPosts, setPlatformPosts] = useState(() =>
    PLATFORMS.map((p) => ({
      id: p.id,
      text: '',
      hashtags: '',
    }))
  );

  // Helper: is any post approved?
  const anyPostApproved = postApprovals.some(Boolean);

  const stepLabels = [
    'Input Content',
    'Post Text Options',
    'Image Prompt Selector',
    'Image Generation',
    'Final Post Review',
  ];

  // Track snapshot of upstream content for image generation
  const [imageGenSnapshot, setImageGenSnapshot] = React.useState({
    blogContent: '',
    selectedPlatforms: [] as string[],
    platformPosts: [] as { id: string; text: string; hashtags: string }[],
    selectedPrompt: '',
  });

  // Reset all state to initial values
  const handleRunNewSet = () => {
    setStep(0);
    setMaxStep(0);
    setBlogContent('');
    setGeneratedImages([]);
    setSelectedImageId('');
    setSelectedPlatforms([]);
    setIsRegenerating(false);
    setLoadingDots('');
    setIsGeneratingPosts(false);
    setImageLoading({});
    setSelectedPrompt('');
    setPostApprovals([]);
    setPlatformPosts(
      PLATFORMS.map((p) => ({
        id: p.id,
        text: '',
        hashtags: '',
      }))
    );
    setShowNewSetModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add loading dots animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRegenerating) {
      interval = setInterval(() => {
        setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRegenerating]);

  const nextStep = () => {
    setStep((prev) => {
      const next = Math.min(prev + 1, 4);
      setMaxStep((m) => Math.max(m, next));
      return next;
    });
  };

  const handleRegenerateImage = async (imgId: string) => {
    setImageLoading(prev => ({ ...prev, [imgId]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneratedImages(prev => prev.map(img =>
        img.id === imgId
          ? { ...img, url: `https://picsum.photos/800/600?random=${Date.now()}-${imgId}` }
          : img
      ));
    } finally {
      setImageLoading(prev => ({ ...prev, [imgId]: false }));
    }
  };

  // Floating nav button style (not used for now)
  // const navBtnClass =
  //   "w-12 h-12 rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-[#f0f4ff] disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100 transition-colors bg-white";
  // const navBtnTransparent =
  //   "bg-transparent hover:bg-transparent shadow-none border border-gray-200";

  // On entering Image Generation step, reset images if upstream content has changed
  React.useEffect(() => {
    if (step === 3) {
      const snapshotChanged =
        imageGenSnapshot.blogContent !== blogContent ||
        JSON.stringify(imageGenSnapshot.selectedPlatforms) !== JSON.stringify(selectedPlatforms) ||
        JSON.stringify(imageGenSnapshot.platformPosts) !== JSON.stringify(platformPosts) ||
        imageGenSnapshot.selectedPrompt !== selectedPrompt;
      if (snapshotChanged) {
        setGeneratedImages([]);
        setSelectedImageId('');
        setImageGenSnapshot({
          blogContent,
          selectedPlatforms: [...selectedPlatforms],
          platformPosts: JSON.parse(JSON.stringify(platformPosts)),
          selectedPrompt,
        });
      }
    }
  }, [step, blogContent, selectedPlatforms, platformPosts, selectedPrompt, imageGenSnapshot]);

  // Reset images if upstream content changes before image generation step
  React.useEffect(() => {
    if (step < 3) {
      setGeneratedImages([]);
      setSelectedImageId('');
    }
  }, [step, blogContent, selectedPlatforms, platformPosts, selectedPrompt]);

  // Watch for changes in prior steps and restrict maxStep
  React.useEffect(() => {
    // If the user is not on the last completed step, and changes upstream content, restrict maxStep
    if (step < maxStep) {
      setMaxStep(step);
    }
  }, [step, maxStep, blogContent, selectedPlatforms, platformPosts, selectedPrompt]);

  // Scroll to the relevant section when step changes
  const prevStepRef = useRef<number | null>(null);
  React.useEffect(() => {
    if (prevStepRef.current === null) {
      prevStepRef.current = step;
      return;
    }
    if (prevStepRef.current !== step) {
      const bar = document.getElementById('step-indicator-bar');
      const headerOffset = (bar ? bar.offsetHeight : 0) + 55; // Add 55px extra buffer
      const section = sectionRefs[step]?.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top = rect.top + scrollTop - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      prevStepRef.current = step;
    }
  }, [step, sectionRefs]);

  return (
    <>
      <StepIndicator
        steps={stepLabels.map(label => ({ label }))}
        currentStep={step}
        maxStep={maxStep}
        onStepClick={(idx) => {
          if (idx <= maxStep) setStep(idx);
        }}
      />
      <header className="w-full h-[65px] bg-white flex items-center mb-8 p-4 md:p-8">
        <h1 className="text-2xl font-bold text-black">Social Media Post Genie</h1>
      </header>
      <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
        {/* Step 0: Blog Input Panel */}
        <div className="transition-opacity duration-700 opacity-100" ref={sectionRefs[0]}>
          <section className="mb-[75px]">
            <div className="flex flex-col md:flex-row md:items-start md:gap-[45px]">
              <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
                <div className="flex items-center justify-between w-full">
                  <h2 className={`text-2xl font-bold mb-2${step > 0 ? ' text-gray-400' : ''}`}>Blog Input Panel</h2>
                  {step > 0 && (
                    <span className="ml-4 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold whitespace-nowrap">Complete</span>
                  )}
                </div>
                {step === 0 && (
                  <>
                    <p className="text-gray-700 dark:text-gray-200 mb-2">
                      Paste your blog post, article, website URL, or any marketing content you&apos;d like to turn into social posts. This is the starting point, so make sure the content is complete and clear.
                    </p>
                    <Checklist
                      items={[
                        { label: 'Input Content', checked: !!blogContent.trim(), optional: false },
                        { label: 'Select Platforms', checked: selectedPlatforms.length > 0, optional: false },
                      ]}
                    />
                  </>
                )}
              </div>
              <div className="w-full md:w-3/4 ml-auto">
                {step === 0 && (
                  <BlogInputPanel 
                    onGenerate={nextStep}
                    selectedPlatforms={selectedPlatforms}
                    setSelectedPlatforms={setSelectedPlatforms}
                    blogContent={blogContent}
                    setBlogContent={setBlogContent}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Step 1: Post Text Options */}
        {step >= 1 && (
          <div className="transition-opacity duration-700 opacity-100" ref={sectionRefs[1]}>
            <section className="mb-[75px]">
              <div className="flex flex-col md:flex-row md:items-start md:gap-[45px]">
                <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
                  <div className="flex items-center justify-between w-full">
                    <h2 className={`text-2xl font-bold mb-2${step > 1 ? ' text-gray-400' : ''}`}>Post Text Options</h2>
                    {step > 1 && (
                      <span className="ml-4 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold whitespace-nowrap">Complete</span>
                    )}
                  </div>
                  {step === 1 && (
                    <>
                      <p className="text-gray-700 dark:text-gray-200 mb-2">
                        Review the suggested copy and hashtags for each platform. Edit or regenerate until the tone and message feel right for your audience.
                      </p>
                      <Checklist
                        items={[
                          { label: 'Edit Text', checked: true, optional: true },
                          { label: 'Edit Hashtags', checked: true, optional: true },
                        ]}
                      />
                    </>
                  )}
                </div>
                <div className="w-full md:w-3/4 ml-auto">
                  {step === 1 && (
                    <>
                      <PostTextOptions
                        selectedPlatforms={selectedPlatforms}
                        platformPosts={platformPosts}
                        setPlatformPosts={setPlatformPosts}
                      />
                      <div className="flex justify-start mt-4">
                        <Button className="min-w-[180px]" onClick={nextStep}>Create Image Direction</Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Step 2: Image Prompt Selector */}
        {step >= 2 && (
          <div className="transition-opacity duration-700 opacity-100" ref={sectionRefs[2]}>
            <section className="mb-[75px]">
              <div className="flex flex-col md:flex-row md:items-start md:gap-[45px]">
                <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
                  <div className="flex items-center justify-between w-full">
                    <h2 className={`text-2xl font-bold mb-2${step > 2 ? ' text-gray-400' : ''}`}>Image Prompt Selector</h2>
                    {step > 2 && (
                      <span className="ml-4 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold whitespace-nowrap">Complete</span>
                    )}
                  </div>
                  {step === 2 && (
                    <>
                      <p className="text-gray-700 dark:text-gray-200 mb-2">
                        Choose a visual direction for your post. Select from AI-suggested prompts or write your own to guide image generation that matches your content.
                      </p>
                      <Checklist
                        items={[
                          { label: 'Select Prompt', checked: !!selectedPrompt, optional: false },
                          { label: 'Edit Prompt', checked: true, optional: true },
                        ]}
                      />
                    </>
                  )}
                </div>
                <div className="w-full md:w-3/4 ml-auto">
                  {step === 2 && (
                    <ImagePromptSelector 
                      selectedPrompt={selectedPrompt}
                      setSelectedPrompt={setSelectedPrompt}
                      onGenerate={(images) => {
                        setGeneratedImages(images);
                        // Update the snapshot to match the current state after images are generated
                        setImageGenSnapshot({
                          blogContent,
                          selectedPlatforms: [...selectedPlatforms],
                          platformPosts: JSON.parse(JSON.stringify(platformPosts)),
                          selectedPrompt,
                        });
                        nextStep();
                      }}
                      blogContent={blogContent}
                      selectedPlatforms={selectedPlatforms}
                      platformPosts={platformPosts}
                    />
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Step 3: Image Generation */}
        {step >= 3 && (
          <div className="transition-opacity duration-700 opacity-100" ref={sectionRefs[3]}>
            <section className="mb-[75px]">
              <div className="flex flex-col md:flex-row md:items-start md:gap-[45px]">
                <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
                  <div className="flex items-center justify-between w-full">
                    <h2 className={`text-2xl font-bold mb-2${step > 3 ? ' text-gray-400' : ''}`}>Image Generation</h2>
                    {step > 3 && (
                      <span className="ml-4 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold whitespace-nowrap">Complete</span>
                    )}
                  </div>
                  {step === 3 && (
                    <>
                      <p className="text-gray-700 dark:text-gray-200 mb-2">
                        Pick your favorite image from the options. Don&apos;t love any of them? Regenerate until you find the one that fits your story.
                      </p>
                      <Checklist
                        items={[
                          { label: 'Select Image', checked: !!selectedImageId, optional: false },
                        ]}
                      />
                    </>
                  )}
                </div>
                {step === 3 && (
                  <div className="w-full md:w-3/4 ml-auto">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {generatedImages.slice(0, 3).map((image) => (
                          <div key={image.id}>
                            <div className="flex justify-end mb-2">
                              <Button
                                className="text-xs px-4 py-2"
                                onClick={() => handleRegenerateImage(image.id)}
                                disabled={!!imageLoading[image.id]}
                                isGenerating={!!imageLoading[image.id]}
                              >
                                {imageLoading[image.id] ? `Regenerating${loadingDots}` : 'Regenerate Image'}
                              </Button>
                            </div>
                            <div
                              className={`aspect-square relative rounded-lg overflow-hidden border-2 cursor-pointer transition-colors
                                ${selectedImageId === image.id 
                                  ? 'border-[#2323ff]' 
                                  : 'border-white hover:border-[#2323ff]'}`}
                              onClick={() => {
                                setSelectedImageId(image.id);
                              }}
                            >
                              <Image
                                src={image.url}
                                alt={image.prompt}
                                className="object-cover w-full h-full"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              {imageLoading[image.id] && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                              )}
                              {/* Selected lozenge bottom right */}
                              {selectedImageId === image.id && (
                                <span className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold shadow">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-start mt-6">
                        <Button
                          onClick={async () => {
                            setIsGeneratingPosts(true);
                            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
                            setIsGeneratingPosts(false);
                            nextStep();
                          }}
                          disabled={!selectedImageId || isGeneratingPosts}
                          isGenerating={isGeneratingPosts}
                          className="min-w-[180px] text-xl py-4"
                        >
                          {isGeneratingPosts ? `Generating${loadingDots}` : 'Resize Image to Platform(s)'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Step 4: Platform Post Grid */}
        {step >= 4 && (
          <div className="transition-opacity duration-700 opacity-100" ref={sectionRefs[4]}>
            <section className="mb-[75px]">
              <div className="flex flex-col md:flex-row md:items-start md:gap-[45px]">
                <div className="w-full md:w-1/4 md:pr-8 mb-6 md:mb-0">
                  <h2 className={`text-2xl font-bold mb-2${step > 4 ? ' text-gray-400' : ''}`}>Final Post Review</h2>
                  <p className="text-gray-700 dark:text-gray-200">
                    Preview your posts for each platform. Make final tweaks, approve what&apos;s ready, and then export or schedule your content with one click.
                  </p>
                  <Checklist
                    items={[
                      { label: 'Edit Post', checked: true, optional: true },
                      { label: selectedPlatforms.length > 1 ? 'Approve Posts' : 'Approve Post', checked: postApprovals.length > 0 && postApprovals.every(Boolean), optional: false },
                    ]}
                  />
                </div>
                <div className="w-full md:w-3/4 ml-auto">
                  <PlatformPostGrid 
                    selectedImageUrl={generatedImages.find(img => img.id === selectedImageId)?.url}
                    selectedImagePrompt={generatedImages.find(img => img.id === selectedImageId)?.prompt}
                    selectedPlatforms={selectedPlatforms}
                    onApprovalChange={setPostApprovals}
                    platformPosts={platformPosts}
                    setPlatformPosts={setPlatformPosts}
                    onRunNewSet={handleRunNewSet}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Animated Bottom Bar: Run a New Set */}
      <div
        className={`fixed bottom-0 z-50 transition-transform duration-500 ${(step === 4 && anyPostApproved) ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ pointerEvents: (step === 4 && anyPostApproved) ? 'auto' : 'none', marginTop: 45, width: '25vw', right: 65 }}
      >
        <button
          className="w-full bg-blue-600 text-white font-semibold text-lg py-4 rounded-t-xl shadow-lg flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
          onClick={() => setShowNewSetModal(true)}
        >
          Run a New Set
        </button>
      </div>

      {/* Modal Overlay for New Set Confirmation */}
      {showNewSetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Start a New Set?</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-200">Are you sure you want to start a new set? <br />This will erase your current progress and cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                onClick={handleRunNewSet}
              >
                Continue
              </button>
              <button
                className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setShowNewSetModal(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
